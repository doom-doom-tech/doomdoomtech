import {Job} from "bullmq";
import Singleton from "../../../common/classes/injectables/Singleton";
import {IJob, IQueue} from "../../../common/types";
import {container, singleton} from "tsyringe";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import _ from "lodash";
import {SingleUserInterface} from "../../user/types";
import {NotifyFollowersNewUploadPayload} from "./NotifyFollowersNewUpload";

export interface PrepareNotifyFollowersNewUploadPayload { artist: SingleUserInterface, trackID: number }

@singleton()
export default class PrepareNotifyFollowersNewUpload extends Singleton implements IJob<PrepareNotifyFollowersNewUploadPayload> {

    private readonly batchSize = 600

    /**
     * Process the job
     * @param job
     */
    public async process(job: Job<PrepareNotifyFollowersNewUploadPayload>) {
        let offset = 0;
        let followers: number[] = [];

        const trackQueue = container.resolve<IQueue>("TrackQueue");

        do {
            followers = await this.getFollowersBatch(job.data.artist, offset, this.batchSize);

            if (followers.length > 0) {
                await trackQueue.addJob<NotifyFollowersNewUploadPayload>("NotifyFollowersNewUpload", {
                    followers: followers,
                    artist: job.data.artist,
                    trackID: job.data.trackID,
                })

                offset += this.batchSize;
            }
        } while (followers.length === this.batchSize);
    }

    /**
     * Gets a batch of 300 followers for the artist
     * @param artist
     * @param offset
     * @param limit
     * @private
     */
    private async getFollowersBatch(artist: SingleUserInterface, offset: number, limit: number) {
        const db = container.resolve<ExtendedPrismaClient>("Database");

        const followers =  await db.follow.findMany({
            where: {
                followsID: Number(artist.id)
            },
            skip: offset,
            take: limit,
        })

        return _.map(followers, follower => follower.userID)
    }
}

PrepareNotifyFollowersNewUpload.register()
