// MoisesPollingMastering.ts

import {IJob, IQueue} from "../../../common/types";
import {Job} from "bullmq";
import axios from "axios";
import {container} from "../../../common/utils/tsyringe";
import {IMediaService} from "../../media/services/MediaService";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {IMediaCompressionService} from "../../media/services/MediaCompressionService";

export class MoisesPollingMastering implements IJob {
    public async process(job: Job<{ trackUUID: string; moisesJobId: string }>): Promise<void> {
        console.log("processing mastering job");
        const { trackUUID, moisesJobId } = job.data;

        const mediaService = container.resolve<IMediaService>("MediaService");
        const mediaCompressionService = container.resolve<IMediaCompressionService>("MediaCompressionService");
        const pollingQueue = container.resolve<IQueue>("TrackPollingQueue");
        const db = container.resolve<ExtendedPrismaClient>("Database");

        try {
            const response = await axios.get(`https://api.music.ai/api/job/${moisesJobId}`, {
                headers: {
                    Authorization: process.env.MUSIC_AI_API_KEY,
                },
            });

            const status = response.data.status;
            console.log(`Polling Moises mastering job ${moisesJobId} for track ${trackUUID}: ${status}`);

            if (status === "SUCCEEDED") {
                const track = await db.track.findFirst({ where: { uuid: trackUUID } });
                if (!track) throw new Error(`Track with UUID ${trackUUID} not found`);

                console.log('compressing audio for filesize')

                const compressed = await mediaCompressionService
                    .audio(response.data.result.mastered)

                console.log('buffer generated. uploading to gcs')

                const signedURL = await mediaService
                    .uploadBuffer(compressed,
                    "audio-mastered.mp3",
                    trackUUID, 'audio/mpeg'
                );

                console.log('compressed buffer uploaded to ', signedURL)

                console.log("mastered url: ", signedURL);

                await db.track.update({
                    where: { uuid: trackUUID },
                    data: {
                        audio_url: signedURL,
                    },
                });

                // Remove repeat
                await pollingQueue.removeRepeatable("moisesPolling.mastering", {
                    every: 30000,
                    jobId: job.id,
                });

                return;
            } else if (status === "FAILED") {
                throw new Error(`Moises job ${moisesJobId} ended with status: ${status}`);
            }
        } catch (error: any) {
            console.error(`Error polling job ${moisesJobId}:`, error.message);
            throw error;
        }
    }
}