import FollowJobs from "../jobs/FollowJobs";
import {Job} from "bullmq";
import Worker from "../../../common/workers/Worker";
import {inject, singleton} from "tsyringe";
import Redis from "ioredis";

@singleton()
class FollowWorker extends Worker {

	constructor(
		@inject("FollowJobs") private readonly jobs: FollowJobs,
		@inject("Redis") redis: Redis
	) { super("FollowQueue", redis) }

	protected async processJob(job: Job): Promise<void> {
		switch (job.name) {
			case "FakeFollowEvent":
				await this.jobs.fakeFollowEvent(job.data); break;
			default:
				throw new Error(`Unknown job: ${job.name}`);
		}
	}
}

export default FollowWorker