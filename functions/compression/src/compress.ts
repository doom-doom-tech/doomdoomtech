import path from "path";
import os from "os";
import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {Readable} from "stream";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import {Upload} from "@aws-sdk/lib-storage";
import sharp from "sharp";
import axios from "axios";
import jwt from "jsonwebtoken";

require('dotenv').config()

// Initialize AWS S3 client for DigitalOcean Spaces
const s3Client = new S3Client({
    endpoint: 'https://ams3.digitaloceanspaces.com',
    region: 'ams3',
    credentials: {
        accessKeyId: process.env.SPACES_KEY as string,
        secretAccessKey: process.env.SPACES_SECRET as string
    }
});

export interface CompressMediaRequest {
    uuid: string
    purpose: string
    filename: string
}

export interface UpdateEntityRequest {
    uuid: string
    purpose: string
    source: string
    filename: string
}

interface FFmpegProgress {
    percent?: number;
    [key: string]: any;
}

interface FFmpegCodecData {
    [key: string]: any;
}

// Helper function to save stream to temporary file
async function streamToFile(inputStream: Readable, filePath: string): Promise<string> {
    console.log(`Starting streamToFile with filePath: ${filePath}`);
    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(filePath);
        inputStream.pipe(fileStream);
        inputStream.on('error', (err) => reject(new Error(`Input stream error: ${err.message}`)));
        fileStream.on('error', (err) => reject(new Error(`File write error: ${err.message}`)));
        fileStream.on('finish', () => {
            console.log(`streamToFile completed for: ${filePath}`);
            resolve(filePath);
        });
    });
}

async function compressVideo({ uuid, purpose, filename }: CompressMediaRequest) {
    console.log(`Starting compressVideo with uuid: ${uuid}, purpose: ${purpose}, filename: ${filename}`);
    // Ensure we have the necessary data
    if(!uuid || !purpose) return

    const name = filename.split('.').shift()
    const extension = filename.split('.').pop()

    const inputKey = `${uuid}/${filename}`;
    const outputKey = `${uuid}/${name}-compressed.${extension}`;

    console.log(`Input key: ${inputKey}, Output key: ${outputKey}`);

    let tempInputFile: string | undefined = undefined;
    let tempOutputFile: string | undefined = undefined;

    try {
        const getCommand = new GetObjectCommand({
            Bucket: 'ddt',
            Key: inputKey
        });

        console.log('Sending S3 GetObjectCommand');
        const { Body } = await s3Client.send(getCommand);

        if (!Body || !(Body instanceof Readable)) {
            throw new Error('Invalid response from S3');
        }

        tempInputFile = path.join(os.tmpdir(), `input-${uuid}.mp4`);
        console.log(`Temporary input file path: ${tempInputFile}`);

        await streamToFile(Body, tempInputFile);

        // Set timeout for FFmpeg processing (5 minutes)
        const PROCESS_TIMEOUT_MS = 5 * 60 * 1000;

        const timeout = setTimeout(() => {
            console.error('FFmpeg processing timed out');
            throw new Error('FFmpeg processing timed out after 5 minutes');
        }, PROCESS_TIMEOUT_MS);

        tempOutputFile = path.join(os.tmpdir(), `output-${uuid}.mp4`);
        console.log(`Temporary output file path: ${tempOutputFile}`);

        await new Promise<void>((resolve, reject) => {
            if (!tempOutputFile) {
                reject(new Error('Temporary output file path is undefined'));
                return;
            }
            ffmpeg(tempInputFile)
                .inputOptions(['-analyzeduration 2000000', '-probesize 2000000'])
                .outputOptions([
                    '-c:v libx264',
                    '-preset ultrafast',
                    '-crf 30',
                    '-c:a aac',
                    '-b:a 128k',
                    '-f mp4',
                    '-movflags +faststart',
                    '-vf scale=1280:-2'
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
                .on('error', (err) => {
                    console.error('FFmpeg error:', err);
                    clearTimeout(timeout);
                    reject(err);
                })
                .save(tempOutputFile);
        });

        if (!fs.existsSync(tempOutputFile) || fs.statSync(tempOutputFile).size === 0) {
            throw new Error('Output file is missing or empty');
        }

        const inputFileSize = fs.statSync(tempInputFile).size;
        const outputFileSize = fs.statSync(tempOutputFile).size;
        console.log(`Input file size: ${inputFileSize} bytes, Output file size: ${outputFileSize} bytes`);

        let fileToUpload = tempOutputFile;

        if (outputFileSize < inputFileSize) {
            console.log('Output file is smaller, proceeding with upload');
            try {
                const fileBuffer = fs.readFileSync(fileToUpload);

                const upload = new Upload({
                    client: s3Client,
                    params: {
                        Bucket: 'ddt',
                        Key: outputKey,
                        Body: fileBuffer,
                        ContentType: 'video/mp4',
                        ACL: 'public-read'
                    }
                });

                console.log('Starting S3 upload');
                await upload.done();
                console.log('S3 upload completed');
            } catch (uploadErr: any) {
                console.error('Upload error details:', uploadErr);
                throw new Error(`Failed to upload to Spaces: ${uploadErr.message}. Code: ${uploadErr.$metadata?.httpStatusCode || 'Unknown'}`);
            }

            console.log('Calling webhook after compression');
            callWebhookAfterCompression({
                uuid, purpose, filename, source: `https://ddt.ams3.digitaloceanspaces.com/${outputKey}`
            })

        } else {
            console.log("Output file is larger than input, skipping upload");
        }

        return {
            body: {
                status: 'success',
                url: `https://ddt.ams3.digitaloceanspaces.com/${outputKey}`
            },
            statusCode: 200
        };
    } catch (error: any) {
        console.error('Error in compressVideo:', error);
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

async function compressImage({ uuid, purpose, filename }: CompressMediaRequest) {
    console.log(`Starting compressImage with uuid: ${uuid}, purpose: ${purpose}, filename: ${filename}`);
    // Ensure we have the necessary data
    if(!uuid || !purpose) return

    const name = filename.split('.').shift()
    const extension = filename.split('.').pop()

    const inputKey = `${uuid}/${filename}`;
    const outputKey = `${uuid}/${name}-compressed.${extension}`;

    let tempInputFile: string | undefined = undefined;
    let tempOutputFile: string | undefined = undefined;

    try {
        const getCommand = new GetObjectCommand({
            Bucket: 'ddt',
            Key: inputKey
        });

        const { Body } = await s3Client.send(getCommand);

        if (!Body || !(Body instanceof Readable)) {
            throw new Error('Invalid response from S3');
        }

        tempInputFile = path.join(os.tmpdir(), `input-${filename}`);

        await streamToFile(Body, tempInputFile);

        // Set timeout for image processing (5 minutes)
        const PROCESS_TIMEOUT_MS = 5 * 60 * 1000;

        const timeout = setTimeout(() => {
            console.error('Image processing timed out');
            throw new Error('Image processing timed out after 5 minutes');
        }, PROCESS_TIMEOUT_MS);

        tempOutputFile = path.join(os.tmpdir(), `output-${filename}`);

        await sharp(tempInputFile)
            .webp({ quality: 80 })
            .rotate()
            .on('end', () => {
                clearTimeout(timeout);
            })
            .toFile(tempOutputFile)

        const inputFileSize = fs.statSync(tempInputFile).size;
        const outputFileSize = fs.statSync(tempOutputFile).size;
        console.log(`Input image size: ${inputFileSize} bytes, Output image size: ${outputFileSize} bytes`);

        if (outputFileSize < inputFileSize) {
            try {
                const buffer = fs.readFileSync(tempOutputFile);

                const upload = new Upload({
                    client:s3Client,
                    params: {
                        Bucket: 'ddt',
                        Key: outputKey,
                        Body: buffer,
                        ContentType: 'image/webp',
                        ACL: 'public-read'
                    }
                });

                console.log('Starting S3 image upload');
                await upload.done();
                console.log('S3 image upload completed');

                console.log('Calling webhook after image compression');
                callWebhookAfterCompression({
                    uuid, purpose, filename, source: `https://ddt.ams3.digitaloceanspaces.com/${outputKey}`
                })
            } catch (uploadErr: any) {
                console.error('Upload error details:', uploadErr);
                throw new Error(`Failed to upload to Spaces: ${uploadErr.message}. Code: ${uploadErr.$metadata?.httpStatusCode || 'Unknown'}`);
            }
        } else {
            console.log("Output image is larger than input, skipping upload");
        }
    } catch (error: any) {
        console.error('Error in compressImage:', error);
    } finally {
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

export default function compress({uuid, purpose, filename}: CompressMediaRequest) {
    console.log(`Starting compress with uuid: ${uuid}, purpose: ${purpose}, filename: ${filename}`);

    if(!uuid || !purpose || !filename) {
        return
    }

    if(["track.audio"].includes(purpose)) {
        return
    }

    if(filename.includes('.mp4')) {
        return compressVideo({uuid, purpose, filename})
    }

    return compressImage({uuid, purpose, filename})
}

async function callWebhookAfterCompression({uuid, purpose, source, filename}: UpdateEntityRequest) {
    console.log(`Starting callWebhookAfterCompression with uuid: ${uuid}, purpose: ${purpose}, source: ${source}, filename: ${filename}`);
    let url: string | undefined = undefined

    switch (purpose) {
        case "track.audio":
            console.log('Purpose is track.audio, skipping webhook');
            return
        case "note.attachment":
            url = `/webhooks/media/update-media`;
            break;
        case "track.cover":
            url = `/webhooks/track/update-cover`;
            break;
        case "track.video":
            url = `/webhooks/track/update-video`;
            break;
        case "user.avatar":
            url = `/webhooks/user/update-avatar`;
            break;
        case "user.banner":
            url = `/webhooks/user/update-banner`;
            break;
    }

    console.log('Webhook URL determined:', url);

    if(!url) {
        console.log('No webhook URL, exiting');
        return
    }

    try {
        console.log('Sending webhook request');
        await axios.put((process.env.BASE_URL as string).concat(url), {
            uuid, source, filename
        }, {
            headers: {
                'Authorization': jwt.sign('token', process.env.TOKEN_SECRET as string),
            }
        });
        console.log('Webhook request completed successfully');
    } catch (error: any) {
        console.error('Webhook request failed:', error.message);
    }
}