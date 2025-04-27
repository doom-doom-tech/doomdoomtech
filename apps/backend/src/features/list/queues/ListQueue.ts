import {JobsOptions, Queue} from "bullmq";
import {inject} from "tsyringe";
import Redis from "ioredis";
import {MutateListTrackRequest} from "../types/requests";

class ListQueue {
	private queue: Queue;

	constructor(
		@inject("Redis") redis: Redis
	) { this.queue = new Queue('ListQueue', { connection: redis }) }

	public scheduleFakeListEvent = async (data: MutateListTrackRequest, config: JobsOptions) => {
		await this.queue.add('fakeListEvent', data, config);
	}
}

export default ListQueue