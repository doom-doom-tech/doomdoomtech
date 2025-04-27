import {Job} from "bullmq";
import AuthJobs from "../jobs/AuthJobs";
import Worker from "../../../common/workers/Worker";
import {inject} from "tsyringe";
import {DeletePasswordResetTokenRequest} from "../types/requests";
import Redis from "ioredis";

class AuthWorker extends Worker {

	constructor(
		@inject("AuthJobs") private readonly jobs: AuthJobs,
		@inject("Redis") private readonly redis: Redis,
	) { super('authQueue', redis) }

	protected async processJob(job: Job<DeletePasswordResetTokenRequest>): Promise<void> {
		switch(job.name) {
			case 'deleteAuthorizationCode': await this.jobs.deleteAuthorizationCodeJob(job.data); break;
			case 'deleteVerificationToken': await this.jobs.deleteVerificationTokenJob(job.data); break;
			default: throw new Error(`Unknown job name: ${job.name}`);
		}
	}
}

export default AuthWorker;