import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import ffmpeg from 'fluent-ffmpeg';
import {createCanvas, loadImage} from 'canvas';
import {v4 as uuidv4} from 'uuid';
import {ensureDir} from "fs-extra";
import prisma from "../../../common/utils/prisma";
import EntityNotFoundError from "../../../common/classes/errors/EntityNotFoundError";
import {execSync} from "child_process";
import {inject, singleton} from "tsyringe";
import {IMediaService} from "../../media/services/MediaService";
import Service, {IServiceInterface} from "../../../common/services/Service";
import https from "https";

export interface ITrackWaveformService extends IServiceInterface {
	createWaveform(data: { uuid: string, source: string }): Promise<string | null>
}

@singleton()
class TrackWaveformService extends Service implements ITrackWaveformService{

	constructor(
		@inject("MediaService") private mediaService: IMediaService
	) { super() }

	public hasAudio = (inputPath: string): boolean => {
		try {
			const ffprobeOutput: Buffer = execSync(`ffprobe -v error -select_streams a:0 -show_entries stream=index -of csv=p=0 "${inputPath}"`);
			return ffprobeOutput.toString().trim().length > 0;
		} catch (error) {
			console.error('Error checking for audio track:', error);
			return false;
		}
	}

	public async createWaveform(data: { uuid: string, source: string }): Promise<string | null> {
		const requestUUID = uuidv4();

		const tempDir = `temp/${requestUUID}`;
		const tempFilepath = path.join(tempDir, data.source.includes('audio') ? 'audio.mp3' : 'video.mp4');
		const waveformFilepath = path.join(tempDir, 'waveform.png');

		await ensureDir(tempDir);

		try {
			// 1) Download the file
			await this.downloadMediaFile(data.source, tempFilepath);

			// 2) Check if file has an audio track
			const hasAudio = await this.checkAudioStream(tempFilepath);
			if (!hasAudio) {
				return null;
			}

			// 4) If it's purely audio, skip extraction. Otherwise, extract audio.
			if (await this.hasVideoStream(tempFilepath)) {
				await this.extractAudio(tempFilepath);
				await this.generateWaveform(tempFilepath.replace('video.mp4', 'audio.mp3'), waveformFilepath);
			} else {
				await this.generateWaveform(tempFilepath, waveformFilepath);
			}

			// 6) Convert waveform image -> array data -> upload
			const waveformData = await this.processWaveformData(waveformFilepath);
			const waveformJsonUrl = await this.uploadWaveformData(waveformData, data.uuid);

			// 7) Update track with the new waveform URL
			await this.updateTrackWaveformUrl(data.uuid, waveformJsonUrl);

			return waveformJsonUrl;
		} catch (error) {
			console.error('Error creating waveform:', error);
			throw error;
		} finally {
			await this.cleanup(tempDir);
		}
	}

	private downloadMediaFile = async (source: string, destinationDir: string): Promise<string> => {
		return new Promise((resolve, reject) => {
			let segments = source.split('/')
			let filename = segments[segments.length - 1]

			const fileStream = fs.createWriteStream(destinationDir);

			// GET request
			const request = https.get(source, (response) => {
				if (response.statusCode !== 200) {
					fileStream.close();
					// fs.unlink(localPath, () => {});
					return reject(
						new Error(`Failed to download file: ${response.statusCode} ${response.statusMessage}`)
					);
				}

				response.pipe(fileStream);

				fileStream.on('finish', () => {
					fileStream.close();
					resolve(destinationDir);
				});
			});

			request.on('error', (err) => {
				fileStream.close();
				reject(err);
			});
		});
	};

	private hasVideoStream = (filePath: string): Promise<boolean> => {
		return new Promise((resolve, reject) => {
			ffmpeg.ffprobe(filePath, (err, metadata) => {
				if (err) {
					reject(err);
					return;
				}
				// Check for any stream with codec_type === 'video'
				const hasVideo = metadata.streams.some(stream => stream.codec_type === 'video');
				resolve(hasVideo);
			});
		});
	};

	private checkAudioStream = (filePath: string): Promise<boolean> => {
		return new Promise((resolve, reject) => {
			ffmpeg.ffprobe(filePath, (err, metadata) => {
				if (err) {
					reject(err);
					return;
				}
				const hasAudioStream = metadata.streams.some(stream => stream.codec_type === 'audio');
				resolve(hasAudioStream);
			});
		});
	}

	private updateTrackWaveformUrl = async (uuid: string, waveformUrl: string): Promise<void> => {
		try {
			const track = await prisma.track.findFirst({ where: { uuid } });

			if (!track) {
				console.error(`Track not found for UUID: ${uuid}`);
				throw new EntityNotFoundError('Track');
			}

			const updatedTrack = await prisma.track.update({
				where: { id: track.id },
				data: { waveform_url: waveformUrl },
			});

			if (updatedTrack.waveform_url !== waveformUrl) {
				console.error(`Failed to update waveform_url for track ${uuid}. Expected: ${waveformUrl}, Actual: ${updatedTrack.waveform_url}`);
				throw new Error('Failed to update waveform_url');
			}
		} catch (error) {
			console.error(`Error updating waveform_url for track ${uuid}:`, error);

			// Log additional details about the error
			if (error instanceof Error) {
				console.error(`Error name: ${error.name}`);
				console.error(`Error message: ${error.message}`);
				console.error(`Error stack: ${error.stack}`);
			}

			// throw error;
		}
	}

	private uploadWaveformData = async (waveformData: Array<{ min: number, max: number }>, uuid: string): Promise<string> => {
		const waveformJson = JSON.stringify(waveformData);
		const waveformBuffer = Buffer.from(waveformJson, 'utf-8');

		const url = await this.mediaService.uploadBuffer(waveformBuffer, 'waveform.json', uuid, 'application/json');

		if (!url) {
			throw new Error('Failed to upload waveform data');
		}

		return url;
	}

	private extractAudio = (fileSource: string): Promise<string> => {

		const outputPath = fileSource.replace('video.mp4', 'audio.mp3')

		return new Promise((resolve, reject) => {
			ffmpeg(fileSource)
				.outputOptions('-vn')
				.audioCodec('libmp3lame')
				.audioFilter('aformat=channel_layouts=mono')
				.output(outputPath)
				.outputOptions('-y')
				.on('start', (commandLine) => {
					console.log('Spawned FFmpeg with command: ' + commandLine);
				})
				.on('progress', (progress) => {
					console.log(`Audio extraction progress: ${progress.percent}%`);
				})
				.on('end', resolve as any)
				.on('error', (err, stdout, stderr) => {
					console.error('Error during audio extraction:', err);
					console.error('FFmpeg stdout:', stdout);
					console.error('FFmpeg stderr:', stderr);
					reject(err);
				})
				.run();
		});
	}

	private generateWaveform = (audioSource: string, waveformDestination: string): Promise<void> => {
		return new Promise((resolve, reject) => {
			ffmpeg(audioSource)
				.complexFilter('showwavespic=s=2560x480:colors=ffffff')
				.output(waveformDestination)
				.outputOptions('-frames:v 1')
				.on('start', (commandLine) => {
					console.log('Spawned FFmpeg with command: ' + commandLine);
				})
				.on('end', resolve as any)
				.on('error', (err, stdout, stderr) => {
					console.error('Error:', err);
					console.error('FFmpeg stdout:', stdout);
					console.error('FFmpeg stderr:', stderr);
					reject(err);
				})
				.run();
		});
	}

	private processWaveformData = async (waveformPath: string): Promise<Array<{ min: number, max: number }>> => {
		try {
			const image = await loadImage(waveformPath);
			const canvas = createCanvas(image.width, image.height);
			const ctx = canvas.getContext('2d');
			ctx.drawImage(image, 0, 0);

			const imageData = ctx.getImageData(0, 0, image.width, image.height);
			const waveformData = [];
			const stepSize = Math.floor(image.width / 128);

			for (let i = 0; i < 128; i++) {
				let min = image.height;
				let max = 0;
				for (let x = i * stepSize; x < (i + 1) * stepSize; x++) {
					for (let y = 0; y < image.height; y++) {
						const index = (y * image.width + x) * 4;
						if (imageData.data[index] > 0) {
							min = Math.min(min, y);
							max = Math.max(max, y);
						}
					}
				}
				const normalizedMin = 1 - (min / image.height);
				const normalizedMax = 1 - (max / image.height);
				waveformData.push({ min: normalizedMin, max: normalizedMax });
			}

			return waveformData;
		} catch (error) {
			console.error('Error processing waveform data:', error);
			throw error;
		}
	}

	private cleanup = async (directory: string): Promise<void> => {
		try {
			await fsPromises.rm(directory, { recursive: true, force: true });
		} catch (error) {
			console.error(`Failed to clean up directory ${directory}:`, error);
			// We don't throw here to avoid masking other errors
		}
	}
}

export default TrackWaveformService;