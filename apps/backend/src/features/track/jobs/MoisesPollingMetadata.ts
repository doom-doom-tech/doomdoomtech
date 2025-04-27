// MoisesPollingMetadata.ts

import {IJob, IQueue} from "../../../common/types";
import {Job, RepeatOptions} from "bullmq";
import axios from "axios";
import {container} from "../../../common/utils/tsyringe";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";

export class MoisesPollingMetadata implements IJob {
    public async process(job: Job<{ trackUUID: string; moisesJobId: string }>): Promise<void> {
        const { trackUUID, moisesJobId } = job.data;

        const db = container.resolve<ExtendedPrismaClient>("Database");
        const pollingQueue = container.resolve<IQueue>("TrackPollingQueue");

        try {
            const response = await axios.get(`https://api.music.ai/api/job/${moisesJobId}`, {
                headers: {
                    Authorization: process.env.MUSIC_AI_API_KEY,
                },
            });

            const status = response.data.status;
            console.log(`Polling Moises metadata job ${moisesJobId} for track ${trackUUID}: ${status}`);

            if (status === "SUCCEEDED") {
                const track = await db.track.findFirst({ where: { uuid: trackUUID } });
                if (!track) throw new Error(`Track with UUID ${trackUUID} not found`);

                const metadata = response.data.result;

                await db.trackMetadata.upsert({
                    where: { trackID: track.id },
                    update: metadata,
                    create: {
                        trackID: track.id,
                        ...metadata
                    }
                });

                await pollingQueue.removeRepeatable(
                    'moisesPolling.metadata',
                    job.opts.repeat as RepeatOptions
                );

                return;
            } else if (status === "FAILED") {
                await pollingQueue.removeRepeatable(
                    'moisesPolling.metadata',
                    job.opts.repeat as RepeatOptions
                );

                throw new Error(`Moises job ${moisesJobId} failed`);
            }
        } catch (error: any) {
            console.error(`Error polling job ${moisesJobId}:`, error.message);
            throw error;
        }
    }
}