import Service from "../../../common/services/Service";
import ffmpeg from "fluent-ffmpeg";
import {inject, singleton} from "tsyringe";
import {IUserService} from "../../user/services/UserService";
import {PassThrough} from "stream";
import fs from "fs/promises";
import {tmpdir} from "os";
import {join} from 'path'

export interface IMediaCompressionService {
    video(inputPath: string): Promise<Buffer>
    audio(inputPath: string): Promise<Buffer>
    extract(videoURL: string): Promise<Buffer>
}

@singleton()
export default class MediaCompressionService extends Service implements IMediaCompressionService {

    constructor(
        @inject("UserService") private userService: IUserService,
    ) { super() }

    public video = (inputPath: string): Promise<Buffer> => {
        return new Promise(async (resolve, reject) => {
            const tempOutputPath = join(tmpdir(), `compressed-${Date.now()}.mp4`);

            const ffmpegProcess = ffmpeg(inputPath)
                .outputOptions([
                    "-c:v libx264",
                    "-preset veryfast",
                    "-crf 30",
                    "-vf scale=1280:720",
                    "-c:a aac",
                    "-b:a 128k",
                    "-movflags +faststart",
                    "-f mp4",
                ])
                .output(tempOutputPath);

            ffmpegProcess
                .on("start", (cmd) => {
                    console.log("FFmpeg process started:", cmd);
                })
                .on("progress", (progress) => {
                    console.log(`Processing: ${progress.percent || "unknown"}% done`);
                })
                .on("error", (err, stdout, stderr) => {
                    console.error("FFmpeg error:", err.message);
                    console.error("FFmpeg stdout:", stdout);
                    console.error("FFmpeg stderr:", stderr);

                    // Only reject if the error occurs before completion
                    if (!fs.exists(tempOutputPath)) {
                        reject(new Error(`FFmpeg failed: ${err.message}\n${stderr}`));
                    }
                })
                .on("end", async () => {
                    try {
                        console.log("FFmpeg process completed");
                        const buffer = await fs.readFile(tempOutputPath);
                        await fs.unlink(tempOutputPath);
                        resolve(buffer);
                    } catch (err: any) {
                        reject(new Error(`Failed to read or clean up temp file: ${err.message}`));
                    }
                })
                .run();
        });
    };

    public audio = async (inputPath: string): Promise<Buffer> => {
        // Simply read the file and return its contents
        return await fs.readFile(inputPath);
    };

    public extract = async (videoURL: string): Promise<Buffer> => {
        return new Promise((resolve, reject) => {
            const passThrough = new PassThrough();
            const buffers: Buffer[] = [];

            passThrough.on('data', (chunk: Buffer) => {
                buffers.push(chunk);
            });

            passThrough.on('error', (err) => {
                console.error('Stream error:', err);
                reject(err);
            });

            passThrough.on('end', () => {
                console.log('Stream ended');
            });

            ffmpeg(videoURL)
                .noVideo()
                .audioCodec('libmp3lame')
                .audioBitrate('128k')
                .audioChannels(2)
                .audioFrequency(44100)
                .outputOptions(['-f mp3'])
                .on('start', (cmd) => {
                    console.log('FFmpeg process started:', cmd);
                })
                .on('progress', (progress) => {
                    console.log(`Processing: ${progress.percent}% done`);
                })
                .on('error', (err) => {
                    console.error('FFmpeg error:', err);
                    reject(err);
                })
                .on('end', () => {
                    console.log('FFmpeg process completed');
                    resolve(Buffer.concat(buffers as any));
                })
                .pipe(passThrough, { end: true });
        });
    };
}