import {IJob, IQueue} from "../../../common/types";
import {Job, RepeatOptions} from "bullmq";
import axios from "axios";
import {container} from "../../../common/utils/tsyringe";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";

export class MoisesPollingMetadata implements IJob {
    public async process(job: Job<{ trackUUID: string; moisesJobId: string }>): Promise<void> {
        const { trackUUID, moisesJobId } = job.data;
        
        console.log(`[MoisesPolling] Starting process for track ${trackUUID}, job ${moisesJobId}`);

        const db = container.resolve<ExtendedPrismaClient>("Database");
        const pollingQueue = container.resolve<IQueue>("TrackPollingQueue");

        try {
            console.log(`[MoisesPolling] Fetching status for job ${moisesJobId}`);
            const response = await axios.get(`https://api.music.ai/api/job/${moisesJobId}`, {
                headers: {
                    Authorization: process.env.MUSIC_AI_API_KEY,
                },
            });

            const status = response.data.status;
            console.log(`[MoisesPolling] Job ${moisesJobId} status: ${status}`);

            if (status === "SUCCEEDED") {
                console.log(`[MoisesPolling] Looking up track ${trackUUID} in database`);
                const track = await db.track.findFirst({ where: { uuid: trackUUID } });
                if (!track) {
                    console.error(`[MoisesPolling] Track ${trackUUID} not found in database`);
                    throw new Error(`Track with UUID ${trackUUID} not found`);
                }

                const metadata = response.data.result;
                console.log(`[MoisesPolling] Updating metadata for track ${trackUUID}`, {
                    metadataFields: Object.keys(metadata)
                });

                await db.trackMetadata.upsert({
                    where: { trackID: track.id },
                    update: metadata,
                    create: {
                        trackID: track.id,
                        ...metadata
                    }
                });

                console.log(`[MoisesPolling] Removing repeatable job ${moisesJobId} from queue`);
                await pollingQueue.removeRepeatable(
                    'moisesPolling.metadata',
                    job.opts.repeat as RepeatOptions
                );

                console.log(`[MoisesPolling] Successfully completed processing for job ${moisesJobId}`);
                return;
            } else if (status === "FAILED") {
                console.error(`[MoisesPolling] Job ${moisesJobId} failed`, response.data);
                await pollingQueue.removeRepeatable(
                    'moisesPolling.metadata',
                    job.opts.repeat as RepeatOptions
                );

                throw new Error(`Moises job ${moisesJobId} failed`);
            }
        } catch (error: any) {
            console.error(`[MoisesPolling] Error processing job ${moisesJobId}:`, {
                message: error.message,
                response: error.response?.data
            });
            throw error;
        }
    }
}