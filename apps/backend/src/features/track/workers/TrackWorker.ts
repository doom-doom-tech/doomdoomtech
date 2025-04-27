import {singleton} from "tsyringe";
import {Worker} from "bullmq";
import Singleton from "../../../common/classes/injectables/Singleton";
import {IWorker} from "../../../common/types";
import {container} from "../../../common/utils/tsyringe";
import {ComputeTrackScoresJob} from "../jobs/ComputeTrackScores";

@singleton()
export class TrackWorker extends Singleton implements IWorker {
    private readonly worker: Worker;

    constructor() {
        super();

        console.log('TrackWorker initialized')

        this.worker = new Worker(
            "TrackQueue",
            async (job) => {
                if (job.name === "computeTrackScores") {
                    const computeJob = container.resolve<ComputeTrackScoresJob>("ComputeTrackScoresJob");
                    await computeJob.process();
                }
            },
            { connection: this.redis, concurrency: 1 }
        );

        this.worker.on("completed", (job) => console.log(`Job ${job.id} completed.`));
        this.worker.on("failed", (job, err) => console.error(`Job ${job?.id} failed: ${err.message}`));
    }

    public static register(): void {
        container.register("TrackWorker", { useClass: TrackWorker });
    }

    public async initialize(): Promise<void> {}

    public async close(): Promise<void> {
        await this.worker.close();
        console.log("TrackWorker closed.");
    }
}

TrackWorker.register();