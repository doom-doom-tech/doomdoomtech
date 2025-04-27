import {JobsOptions, Queue} from "bullmq";
import {singleton} from "tsyringe";
import Singleton from "../../../common/classes/injectables/Singleton";
import {FakeFollowEventRequest} from "../../factory/types/requests";

export interface IFollowQueue {
	scheduleFakeFollowEvent(data: FakeFollowEventRequest, config: JobsOptions): Promise<void>
}

@singleton()
class FollowQueue extends Singleton implements IFollowQueue {
	private queue: Queue;

	constructor() {
		super()
		this.queue = new Queue('FollowQueue', { connection: this.redis});
	}

	public scheduleFakeFollowEvent = async (data: FakeFollowEventRequest, config: JobsOptions) => {
		await this.queue.add('FakeFollowEvent', data, config);
	}
}

export default FollowQueue