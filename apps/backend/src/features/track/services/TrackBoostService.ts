import Service, {IServiceInterface} from '../../../common/services/Service';
import ffmpeg from 'fluent-ffmpeg';
import {IMediaService} from '../../media/services/MediaService';
import {container} from '../../../common/utils/tsyringe';
import {PassThrough} from 'stream';
import {IQueue} from "../../../common/types";
import axios from "axios";
import {singleton} from "tsyringe";

export interface ITrackBoostService extends IServiceInterface {
    metadata(trackUUID: string, audioURL: string): Promise<void>;
    mastering(trackUUID: string, audioURL: string): Promise<void>;
}

@singleton()
class TrackBoostService extends Service implements ITrackBoostService {
    constructor() {
        super();
    }

    /** Processes metadata for a track by generating a sample and submitting a job */
    public metadata = async (trackUUID: string, audioURL: string) => {
        const mediaService = container.resolve<IMediaService>('MediaService');
        const pollingQueue = container.resolve<IQueue>('TrackPollingQueue');

        try {
            // Get audio duration
            const duration = await this.getAudioDuration(audioURL);
            // Determine sample parameters based on duration
            const { startTime, sampleDuration } = this.getSampleParameters(duration);
            // Process audio to generate sample buffer
            const buffer = await this.processAudio(audioURL, startTime, sampleDuration);
            // Upload the processed sample
            const sampleURL = await mediaService.uploadBuffer(buffer, 'sample.mp3', trackUUID, 'audio/mpeg');

            // Submit metadata job to the API
            const response = await axios.post('https://api.music.ai/api/job', {
                name: 'Metadata',
                workflow: 'metadata',
                params: { url: sampleURL },
            }, {
                headers: {
                    'Authorization': process.env.MUSIC_AI_API_KEY
                }
            });

            const moisesJobId = response.data.id;

            // Add polling job to monitor progress
            await pollingQueue.addJob(
                'moisesPolling.metadata',
                { trackUUID, moisesJobId },
                {
                    repeat: { every: 10000 },
                    removeOnComplete: true,
                    removeOnFail: true,
                    attempts: 10,
                    backoff: { type: 'exponential', delay: 5000 },
                }
            );

            console.log(`Started polling for Moises job ${moisesJobId}`);
        } catch (error) {
            console.error('Error in metadata processing:', error);
            // Optionally, rethrow the error or handle it based on your application's needs
        }
    };

    /** Submits a mastering job for a track */
    public mastering = async (trackUUID: string, audioURL: string) => {
        const pollingQueue = container.resolve<IQueue>('TrackPollingQueue');

        const response = await axios.post('https://api.music.ai/api/job', {
            name: 'Mastering',
            workflow: 'mastering',
            params: { url: audioURL },
        }, {
            headers: {
                'Authorization': process.env.MUSIC_AI_API_KEY
            }
        });

        const moisesJobId = response.data.id;

        await pollingQueue.addJob(
            'moisesPolling.mastering',
            { trackUUID, moisesJobId },
            {
                repeat: { every: 30000 },
                removeOnComplete: true,
                removeOnFail: true,
                attempts: 20,
                backoff: { type: 'exponential', delay: 5000 },
            }
        );

        console.log('mastering job added');
    };

    /** Gets the duration of an audio file using ffprobe */
    private getAudioDuration = async (audioURL: string): Promise<number> => {
        return new Promise((resolve, reject) => {
            if (!audioURL) {
                return reject(new Error('Invalid audioURL provided'));
            }
            ffmpeg.ffprobe(audioURL, (err, metadata) => {
                if (err) {
                    console.error('ffprobe error:', err);
                    return reject(err);
                }
                if (!metadata || !metadata.format) {
                    return reject(new Error('Invalid metadata received'));
                }
                resolve(metadata.format.duration ?? 0);
            });
        });
    };

    /** Determines the start time and sample duration based on audio length */
    private getSampleParameters = (duration: number): { startTime: number, sampleDuration: number } => {
        const defaultSampleDuration = 15;
        const defaultStartTime = 30;

        switch (true) {
            case duration <= 15:
                return { startTime: 0, sampleDuration: duration };
            case duration < 45:
                return { startTime: 0, sampleDuration: defaultSampleDuration };
            default:
                return { startTime: defaultStartTime, sampleDuration: defaultSampleDuration };
        }
    };

    /** Processes the audio with FFmpeg and returns the processed buffer */
    private processAudio = async (audioURL: string, startTime: number, sampleDuration: number): Promise<Buffer> => {
        return new Promise((resolve, reject) => {
            const passThrough = new PassThrough();
            const buffers: Buffer[] = [];

            passThrough.on('data', (chunk: Buffer) => buffers.push(chunk));
            passThrough.on('error', (err) => reject(err));
            passThrough.on('end', () => resolve(Buffer.concat(buffers as any as Uint8Array[])));

            ffmpeg(audioURL)
                .setStartTime(startTime)
                .setDuration(sampleDuration)
                .audioCodec('libmp3lame')
                .audioBitrate('128k')
                .audioChannels(2)
                .audioFrequency(44100)
                .outputOptions(['-f mp3'])
                .on('start', (cmd) => console.log('FFmpeg process started:', cmd))
                .on('progress', (progress) => console.log(`Processing: ${progress.percent}% done`))
                .on('error', (err) => reject(err))
                .pipe(passThrough, { end: true });
        });
    };
}

TrackBoostService.register();