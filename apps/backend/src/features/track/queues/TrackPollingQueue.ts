import {BaseJobOptions, Job, Queue, RepeatOptions} from "bullmq";
import {IQueue} from "../../../common/types";
import {singleton} from "tsyringe";
import Singleton from "../../../common/classes/injectables/Singleton";

@singleton()
export class TrackPollingQueue extends Singleton implements IQueue {
    private queue: Queue;

    constructor() {
        super();
        this.queue = new Queue("TrackPollingQueue", { connection: this.redis });
    }

    public async initialize(): Promise<void> {}

    public async close(): Promise<void> {
        await this.queue.close();
    }

    public async addJob<T>(name: string, data: T, options?: BaseJobOptions): Promise<Job<T>> {
        return this.queue.add(name, data, options);
    }

    public async removeRepeatable(name: string, repeatOpts: RepeatOptions) {
        await this.queue.removeRepeatable(name, repeatOpts);
    }
}

TrackPollingQueue.register()