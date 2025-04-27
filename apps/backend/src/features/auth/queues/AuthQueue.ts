import {JobsOptions, Queue} from "bullmq";
import {DeleteAuthorizationCodeRequest} from "../types/requests";
import Singleton from "../../../common/classes/injectables/Singleton";
import {singleton} from "tsyringe";

export interface IAuthQueue {
	scheduleDeleteAuthorizationCodeJob(data: DeleteAuthorizationCodeRequest): Promise<void>
	scheduleDeleteVerificationTokenJob(data: { email: string }): Promise<void>
}

@singleton()
class AuthQueue extends Singleton implements IAuthQueue {

	private queue: Queue

	public constructor() {
		super()
		this.queue = new Queue('authQueue', { connection: this.redis })
	}

	public scheduleDeleteAuthorizationCodeJob = async (data: DeleteAuthorizationCodeRequest) => {
		const options: JobsOptions = { delay: 15 * 60 * 1000 };
		await this.queue.add('deleteAuthorizationCode', data, options);
	}

	public scheduleDeleteVerificationTokenJob = async (data: { email: string }) => {
		const options: JobsOptions = { delay: 15 * 60 * 1000 };
		await this.queue.add('deleteVerificationToken', data, options);
	}
}

AuthQueue.register()