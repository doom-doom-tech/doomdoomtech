import {Worker} from "bullmq";
import {singleton} from "tsyringe";
import SendNotificationBatch from "../jobs/SendNotificationBatch";
import {container} from "../../../common/utils/tsyringe";
import Singleton from "../../../common/classes/injectables/Singleton";
import {IWorker} from "../../../common/types";
import SendNotification from "../jobs/SendNotification";

@singleton()
class NotificationWorker extends Singleton implements IWorker {

	private readonly worker: Worker;

	constructor() {
		super();

		this.worker = new Worker(
			"NotificationQueue",
			async (job) => {
				try {
					switch (job.name) {
						case "SendPushNotification": {
							const computeJob = container.resolve<SendNotification>("SendNotification");
							await computeJob.process(job.data);
							break;
						}
						case "SendNotificationBatch": {
							const computeJob = container.resolve<SendNotificationBatch>("SendNotificationBatch");
							await computeJob.process(job);
							break;
						}
						default:
							console.warn("Unknown job type:", job.name);
					}
				} catch (error) {
					console.error("Error processing job:", job.id, error);
					throw error; // Propagate the error to trigger BullMQ retry
				}
			},
			{ connection: this.redis, concurrency: 1 }
		);

		this.worker.on("completed", (job) => console.log(`Job ${job.id} completed.`));
		this.worker.on("failed", (job, err) => console.error(`Job ${job?.id} failed: ${err.message}`));
	}

	public static register(): void {
		container.register("NotificationWorker", { useClass: NotificationWorker });
	}

	public async initialize(): Promise<void> {}

	public async close(): Promise<void> {
		await this.worker.close();
		console.log("NotificationWorker closed.");
	}
}

export default NotificationWorker;