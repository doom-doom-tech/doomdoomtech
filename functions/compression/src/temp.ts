import {GetObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {Upload} from '@aws-sdk/lib-storage';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {Readable} from 'stream';

// Initialize AWS S3 client for DigitalOcean Spaces
const s3Client = new S3Client({
    endpoint: 'https://ams3.digitaloceanspaces.com',
    region: 'ams3',
    credentials: {
        accessKeyId: process.env.SPACES_KEY as string,
        secretAccessKey: process.env.SPACES_SECRET as string
    }
});

// Helper function to save stream to temporary file
async function streamToFile(inputStream: Readable, filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(filePath);
        inputStream.pipe(fileStream);
        inputStream.on('error', (err) => reject(new Error(`Input stream error: ${err.message}`)));
        fileStream.on('error', (err) => reject(new Error(`File write error: ${err.message}`)));
        fileStream.on('finish', () => resolve(filePath));
    });
}

interface Arguments {
    inputKey: string;
}

interface ResponseBody {
    status: 'success' | 'error';
    message?: string;
    url?: string;
}

interface Response {
    body: ResponseBody;
    statusCode: number;
}

interface FFmpegProgress {
    percent?: number;
    [key: string]: any;
}

interface FFmpegCodecData {
    [key: string]: any;
}

async function main(args: Arguments): Promise<Response> {
    const { inputKey } = args;

    if (!inputKey) {
        return {
            body: { status: 'error', message: 'Missing inputKey' },
            statusCode: 400
        };
    }

    let tempInputFile: string | undefined = undefined;
    let tempOutputFile: string | undefined = undefined;

    try {
        const [uuid] = inputKey.split('/');

        if (!uuid) {
            return {
                body: { status: 'error', message: 'Invalid UUID in inputKey' },
                statusCode: 400
            };
        }

        const outputKey = `${uuid}/video-compressed.mp4`;

        const getCommand = new GetObjectCommand({
            Bucket: 'ddt',
            Key: inputKey
        });

        const { Body } = await s3Client.send(getCommand);

        if (!Body || !(Body instanceof Readable)) {
            throw new Error('Invalid response from S3');
        }

        tempInputFile = path.join(os.tmpdir(), `input-${uuid}.mp4`);

        await streamToFile(Body, tempInputFile);

        console.log(`Input file saved to: ${tempInputFile}`);

        if (!fs.existsSync(tempInputFile) || fs.statSync(tempInputFile).size === 0) {
            throw new Error('Input file is missing or empty');
        }

        // Log input file size
        const inputFileSize = fs.statSync(tempInputFile).size;
        console.log(`Input file size: ${inputFileSize} bytes (${(inputFileSize / 1024 / 1024).toFixed(2)} MB)`);

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

        // Process video with FFmpeg, saving to temporary file
        console.log('Starting FFmpeg processing');
        await new Promise<void>((resolve, reject) => {
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
                .on('start', (cmd: string) => console.log('FFmpeg command:', cmd))
                .on('codecData', (data: FFmpegCodecData) => console.log('Input codec data:', data))
                .on('progress', (progress: FFmpegProgress) => console.log(`Progress: ${progress.percent || 'unknown'}%`))
                .on('stderr', (stderrLine: string) => console.log('FFmpeg stderr:', stderrLine))
                .on('end', () => {
                    console.log('FFmpeg completed');
                    clearTimeout(timeout);
                    resolve();
                })
                .save(tempOutputFile);
        });

        if (!fs.existsSync(tempOutputFile) || fs.statSync(tempOutputFile).size === 0) {
            throw new Error('Output file is missing or empty');
        }

        const outputFileSize = fs.statSync(tempOutputFile).size;

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
            } catch (uploadErr: any) {
                console.error('Upload error details:', uploadErr);
                throw new Error(`Failed to upload to Spaces: ${uploadErr.message}. Code: ${uploadErr.$metadata?.httpStatusCode || 'Unknown'}`);
            }
        } else {
            console.log("Output file is larger than input, skipping upload");
        }

        console.log('Upload completed');
        return {
            body: {
                status: 'success',
                url: `https://ddt.ams3.digitaloceanspaces.com/${outputKey}`
            },
            statusCode: 200
        };
    } catch (error: any) {
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
                    console.error('Failed to clean up temporary file:', err instanceof Error ? err.message : 'Unknown error');
                }
            }
        }
    }
}

export { main };