import {BaseJobOptions, Job, Queue, RepeatOptions} from "bullmq";
import {singleton} from "tsyringe";
import Singleton from "../../../common/classes/injectables/Singleton";
import {IQueue} from "../../../common/types";

@singleton()
class NotificationQueue extends Singleton implements IQueue {
	private queue : Queue

	public constructor() {
		super()
		this.queue = new Queue('notificationQueue', { connection: this.redis })
	}

	public async initialize(): Promise<void>
	{}

	public async addJob<T>(name: string, data: T, options?: BaseJobOptions): Promise<Job<T>> {
		return this.queue.add(name, data, options);
	}

	public async removeRepeatable(name: string, options: RepeatOptions) {
		await this.queue.removeRepeatable(name, options)
	}

	public async close(): Promise<void> {
		await this.queue.close();
	}
}

NotificationQueue.register()