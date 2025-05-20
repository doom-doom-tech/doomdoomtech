import {singleton} from "tsyringe";
import {BaseJobOptions, Job, Queue, RepeatOptions} from "bullmq";
import Singleton from "../../../common/classes/injectables/Singleton";
import {IQueue} from "../../../common/types";

@singleton()
export class TrackQueue extends Singleton implements IQueue {

    private static readonly REPEAT_PATTERN = {
        EVERY_3_HOURS: "0 */3 * * *",
    } as const;

    private readonly queue: Queue;

    constructor() {
        super();
        this.queue = new Queue("TrackQueue", { connection: this.redis });
    }

    public async initialize(): Promise<void> {
        await this.removeExistingRepeatableJobs();
        await this.queue.add(
            "computeTrackScores",
            {},
            {
                repeat: {
                    pattern: TrackQueue.REPEAT_PATTERN.EVERY_3_HOURS,
                    key: "compute-score-batch",
                },
                jobId: "compute-score-batch",
            }
        );
    }

    public async close(): Promise<void> {
        await this.queue.close();
    }

    public async addJob<T>(name: string, data: T, options?: BaseJobOptions): Promise<Job<T>> {
        return this.queue.add(name, data, options);
    }

    public async removeRepeatable(name: string, options: RepeatOptions) {
        await this.queue.removeRepeatable(name, options)
    }

    private async removeExistingRepeatableJobs(): Promise<void> {
        const repeatableJobs = await this.queue.getRepeatableJobs();
        const computeScoreJobs = repeatableJobs.filter((job) => job.key.startsWith("compute-score-"));
        await Promise.all(computeScoreJobs.map((job) => this.queue.removeRepeatableByKey(job.key)));
    }
}

TrackQueue.register()