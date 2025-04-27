import {Job} from "bullmq";
import Singleton from "../../../common/classes/injectables/Singleton";
import {IJob, IQueue} from "../../../common/types";
import {container, singleton} from "tsyringe";
import {SingleUserInterface} from "../../user/types";
import _ from "lodash";
import {SendPushNotificationRequest} from "../../notification/types/requests";
import createNotificationText from "../../notification/utils/CreateNotificationText";

export interface NotifyFollowersNewUploadPayload {
    followers: Array<number>
    artist: SingleUserInterface;
    trackID: number
}

@singleton()
class NotifyFollowersNewUpload extends Singleton implements IJob<NotifyFollowersNewUploadPayload> {

    /**
     * Process the job
     * @param job
     */
    public async process(job: Job<NotifyFollowersNewUploadPayload>): Promise<void> {
        await this.addSendNotificationBatchJob(job.data.followers, job.data.artist, job.data.trackID)
    }

    /**
     * Adds a batch job to the queue per 300 followers batch to notify later
     * @param followers
     * @param artist
     * @param trackID
     * @private
     */
    private async addSendNotificationBatchJob(followers: Array<number>, artist: SingleUserInterface, trackID: number) {
        const queue = container
            .resolve<IQueue>("NotificationQueue");

        await queue.addJob("SendNotificationBatch", {
            notifications: _.map(followers, follower => ({
                body: artist.username + ' ' + createNotificationText('Upload'),
                title: 'New release 🔥',
                userID: artist.id,
                entityID: trackID,
                targetID: follower,
                data: { url: `/tracks/${trackID}` },
                action: 'Upload',
                entityType: 'Track',
            } as SendPushNotificationRequest)),
        }, {
            delay: 0,
            attempts: 5,
            backoff: {
                type: "exponential",
                delay: 1000,
            },
        });
    }
}

NotifyFollowersNewUpload.register()