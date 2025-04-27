import {singleton} from "tsyringe";
import Singleton from "../../../common/classes/injectables/Singleton";
import {IJob} from "../../../common/types";
import {Job} from "bullmq";
import {SendPushNotificationRequest} from "../types/requests";
import {container} from "../../../common/utils/tsyringe";
import {INotificationService} from "../services/NotificationService";


export interface SendNotificationBatchPayload { notifications: Array<SendPushNotificationRequest> }

@singleton()
export default class SendNotificationBatch extends Singleton implements IJob {
    /**
     * Process the job
     * @param job
     */
    public async process(job: Job<SendNotificationBatchPayload>): Promise<void> {
        const notificationService = container
            .resolve<INotificationService>("NotificationService")

        for(let notification of job.data.notifications) {
            await notificationService.send(notification)
        }
    }
}

SendNotificationBatch.register()