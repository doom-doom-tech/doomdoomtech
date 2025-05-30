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
        const pollingQueue = container.resolve<IQueue>('TrackPollingQueue');

        try {
            // Submit metadata job to the API
            const response = await axios.post('https://api.music.ai/api/job', {
                name: 'Metadata',
                workflow: 'metadata',
                params: { url: audioURL },
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
        } catch (error) {
            console.error('Error in metadata processing:', error);
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

    };
}

TrackBoostService.register();