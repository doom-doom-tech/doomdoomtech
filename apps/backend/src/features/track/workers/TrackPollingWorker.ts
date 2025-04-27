import {Job, Worker} from "bullmq";
import {IWorker} from "../../../common/types";
import {container} from "../../../common/utils/tsyringe";
import {MoisesPollingMetadata} from "../jobs/MoisesPollingMetadata";
import {MoisesPollingMastering} from "../jobs/MoisesPollingMastering";
import {singleton} from "tsyringe";
import Singleton from "../../../common/classes/injectables/Singleton";

@singleton()
export class TrackPollingWorker extends Singleton implements IWorker {
    private worker: Worker;

    constructor() {
        super()

        this.worker = new Worker(
            "TrackPollingQueue",
            async (job: Job) => {
                console.log("Job triggered:", job);

                if (job.name === "moisesPolling.metadata") {
                    const pollingJob = container.resolve<MoisesPollingMetadata>("MoisesPollingMetadata");
                    await pollingJob.process(job);
                }

                if (job.name === "moisesPolling.mastering") {
                    const pollingJob = container.resolve<MoisesPollingMastering>("MoisesPollingMastering");
                    await pollingJob.process(job);
                }
            },
            { connection: this.redis, concurrency: 200 }
        );

        this.worker.on("completed", (job) => console.log(`Job ${job.id} completed.`));
        this.worker.on("failed", (job, err) =>
            console.error(`Job ${job?.id} failed: ${err.message}`)
        );
    }

    public static register(): void {
        container.register("TrackPollingWorker", { useClass: TrackPollingWorker });
    }

    public async initialize(): Promise<void> {}

    public async close(): Promise<void> {
        await this.worker.close();
        console.log('TrackPollingWorker closed.');
    }
}

TrackPollingWorker.register()