import {execSync} from "child_process";

const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Set FFmpeg and FFprobe paths
const ffmpegPath = path.join(__dirname, 'bin', 'ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
console.log(`Using FFmpeg binary at: ${ffmpegPath}`);

// Initialize AWS S3 client for DigitalOcean Spaces
const s3Client = new S3Client({
    endpoint: 'https://ams3.digitaloceanspaces.com',
    region: 'ams3',
    credentials: {
        accessKeyId: 'DO801U2WW73VPT78GVKP',
        secretAccessKey: 'FjGoNkh9ONPeMk75wprKqZ5xW4RueK9latwl87WZ0V0'
    }
});

// Helper function to save stream to temporary file
async function streamToFile(inputStream, filePath) {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(filePath);
        inputStream.pipe(fileStream);
        inputStream.on('error', (err) => reject(new Error(`Input stream error: ${err.message}`)));
        fileStream.on('error', (err) => reject(new Error(`File write error: ${err.message}`)));
        fileStream.on('finish', () => resolve(filePath));
    });
}

// Main serverless function
async function main(args) {
    const { inputKey } = args;

    if (!inputKey) {
        return {
            body: { status: 'error', message: 'Missing inputKey' },
            statusCode: 400
        };
    }

    let tempInputFile;
    let tempOutputFile;
    try {
        const [uuid] = inputKey.split('/');
        if (!uuid) {
            return {
                body: { status: 'error', message: 'Invalid UUID in inputKey' },
                statusCode: 400
            };
        }

        const outputKey = `${uuid}/video-compressed.mp4`;

        // Download file from DigitalOcean Spaces using AWS SDK
        console.log(`Downloading input file from Spaces: ${inputKey}`);
        const getCommand = new GetObjectCommand({
            Bucket: 'ddt',
            Key: inputKey
        });
        const { Body } = await s3Client.send(getCommand);
        tempInputFile = path.join(os.tmpdir(), `input-${uuid}.mp4`);
        await streamToFile(Body, tempInputFile);
        console.log(`Input file saved to: ${tempInputFile}`);

        // Verify input file exists and is not empty
        if (!fs.existsSync(tempInputFile) || fs.statSync(tempInputFile).size === 0) {
            throw new Error('Input file is missing or empty');
        }

        // Log input file size
        const inputFileSize = fs.statSync(tempInputFile).size;
        console.log(`Input file size: ${inputFileSize} bytes (${(inputFileSize / 1024 / 1024).toFixed(2)} MB)`);

        // Set temporary output file path
        tempOutputFile = path.join(os.tmpdir(), `output-${uuid}.mp4`);

        // Set timeout for FFmpeg processing (5 minutes)
        const PROCESS_TIMEOUT_MS = 5 * 60 * 1000;
        const timeout = setTimeout(() => {
            console.error('FFmpeg processing timed out');
            throw new Error('FFmpeg processing timed out after 5 minutes');
        }, PROCESS_TIMEOUT_MS);

        // Add this before starting FFmpeg
        console.log('System info:', {
            platform: os.platform(),
            arch: os.arch(),
            version: os.version(),
            freemem: os.freemem(),
            totalmem: os.totalmem(),
            tmpdir: os.tmpdir()
        });

        // Test FFmpeg binary
        try {
            const { execSync } = require('child_process');
            console.log('FFmpeg version:', execSync(`${ffmpegStatic} -version`).toString().split('\n')[0]);
        } catch (e) {
            console.error('Failed to execute FFmpeg binary:', e.message);
        }

        // Process video with FFmpeg, saving to temporary file
        console.log('Starting FFmpeg processing');
        await new Promise((resolve, reject) => {
            ffmpeg(tempInputFile)
                .inputOptions(['-analyzeduration 2000000', '-probesize 2000000']) // Reduced values
                .outputOptions([
                    '-c:v libx264',
                    '-preset ultrafast', // Keep this for speed
                    '-crf 30',
                    '-c:a aac',
                    '-b:a 128k',
                    '-f mp4',
                    '-movflags +faststart',
                    '-vf scale=1280:-2' // Add scaling to reduce resource usage
                ])
                .on('start', (cmd) => console.log('FFmpeg command:', cmd))
                .on('codecData', (data) => console.log('Input codec data:', data))
                .on('progress', (progress) => console.log(`Progress: ${progress.percent || 'unknown'}%`))
                .on('stderr', (stderrLine) => console.log('FFmpeg stderr:', stderrLine))
                .on('error', (err, stdout, stderr) => {
                    console.error('FFmpeg error:', err.message, 'Stderr:', stderr);
                    clearTimeout(timeout);
                    reject(new Error(`FFmpeg error: ${err.message}. Stderr: ${stderr}`));
                })
                .on('end', () => {
                    console.log('FFmpeg completed');
                    clearTimeout(timeout);
                    resolve();
                })
                .save(tempOutputFile);
        });

        // Verify output file exists and is not empty
        if (!fs.existsSync(tempOutputFile) || fs.statSync(tempOutputFile).size === 0) {
            throw new Error('Output file is missing or empty');
        }

        // Log output file size and compression ratio
        const outputFileSize = fs.statSync(tempOutputFile).size;
        const compressionRatio = (inputFileSize / outputFileSize).toFixed(2);
        console.log(`Output file size: ${outputFileSize} bytes (${(outputFileSize / 1024 / 1024).toFixed(2)} MB)`);
        console.log(`Compression ratio: ${compressionRatio}x (${compressionRatio > 1 ? 'smaller' : 'larger'})`);

        let fileToUpload = tempOutputFile;

        if (outputFileSize < inputFileSize) {
            // Upload a processed file to Spaces using AWS SDK
            console.log(`Uploading output file to Spaces: ${outputKey}`);
            try {
                // Read file into buffer instead of using a stream to avoid ERANGE errors
                console.log(`Reading file into buffer from: ${fileToUpload}`);
                const fileBuffer = fs.readFileSync(fileToUpload);
                console.log(`File size: ${fileBuffer.length} bytes`);

                const upload = new Upload({
                    client: s3Client,
                    params: {
                        Bucket: 'ddt',
                        Key: outputKey,
                        Body: fileBuffer,
                        ContentType: 'video/mp4',
                        ACL: 'private'
                    }
                });
                await upload.done();
            } catch (uploadErr) {
                console.error('Upload error details:', uploadErr);
                throw new Error(`Failed to upload to Spaces: ${uploadErr.message}. Code: ${uploadErr.$metadata?.httpStatusCode || 'Unknown'}`);
            }
        } else {
            console.log("Output file is larger than input, skipping upload")
        }

        console.log('Upload completed');
        return {
            body: {
                status: 'success',
                url: `https://ddt.ams3.digitaloceanspaces.com/${outputKey}`
            },
            statusCode: 200
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            body: { status: 'error', message: error.message || 'Unknown error occurred' },
            statusCode: 500
        };
    } finally {
        // Clean up temporary files
        for (const file of [tempInputFile, tempOutputFile]) {
            if (file && fs.existsSync(file)) {
                try {
                    fs.unlinkSync(file);
                    console.log(`Cleaned up temporary file: ${file}`);
                } catch (err) {
                    console.error('Failed to clean up temporary file:', err.message);
                }
            }
        }
    }
}

module.exports = { main };
