import {singleton} from "tsyringe";
import Singleton from "../../../common/classes/injectables/Singleton";
import {IJob} from "../../../common/types";
import {Job} from "bullmq";
import {INotificationService} from "../services/NotificationService";
import {container} from "../../../common/utils/tsyringe";
import {SendPushNotificationRequest} from "../types/requests";

@singleton()
export default class SendNotification extends Singleton implements IJob {
    /**
     * Process the job
     * @param job
     */
    public async process(job: Job<SendPushNotificationRequest>): Promise<void> {
       await container
           .resolve<INotificationService>("NotificationService")
           .send(job.data);
    }
}

SendNotification.register()