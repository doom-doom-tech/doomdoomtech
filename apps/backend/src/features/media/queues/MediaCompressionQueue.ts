import {singleton} from "tsyringe";
import Singleton from "../../../common/classes/injectables/Singleton";
import {IQueue} from "../../../common/types";
import {BaseJobOptions, Job, Queue, RepeatOptions} from "bullmq";

@singleton()
export class MediaCompressionQueue extends Singleton implements IQueue {
    private readonly queue: Queue;

    constructor() {
        super();
        this.queue = new Queue("MediaCompressionQueue", { connection: this.redis });
    }

    public async initialize(): Promise<void>
    {}

    public async close(): Promise<void> {
        await this.queue.close();
        console.log("MediaCompressionQueue closed.");
    }

    public async addJob<T>(name: string, data: T, options?: BaseJobOptions): Promise<Job<T>> {
        return this.queue.add(name, data, options);
    }

    public async removeRepeatable(name: string, options: RepeatOptions) {
        await this.queue.removeRepeatable(name, options)
    }
}

MediaCompressionQueue.register()