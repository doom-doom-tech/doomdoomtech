import {container, singleton} from "tsyringe";
import {IQueue, IWorker} from "../types";
import RedisClient from "../classes/cache/RedisClient";
import {TrackPollingQueue} from "../../features/track/queues/TrackPollingQueue";
import {TrackPollingWorker} from "../../features/track/workers/TrackPollingWorker";
import {TrackWorker} from "../../features/track/workers/TrackWorker";
import {TrackQueue} from "../../features/track/queues/TrackQueue";

export interface IQueueWorkerManager {
    shutdown(): Promise<void>
    initialize(): Promise<void>
    registerQueue(queue: IQueue): void
    registerWorker(worker: IWorker): void
}

@singleton()
export class QueueWorkerManager implements IQueueWorkerManager {
    private queues: IQueue[] = [];
    private workers: IWorker[] = [];

    public static register(): void {
        container.register("QueueWorkerManager", { useClass: QueueWorkerManager });
    }

    public registerQueue(queue: IQueue): void {
        this.queues.push(queue);
    }

    public registerWorker(worker: IWorker): void {
        this.workers.push(worker);
    }

    public async initialize(): Promise<void> {

        const trackPollingQueue = container.resolve<TrackPollingQueue>("TrackPollingQueue")
        const trackPollingWorker = container.resolve<TrackPollingWorker>("TrackPollingWorker")

        const trackQueue = container.resolve<IQueue>("TrackQueue")
        const trackWorker = container.resolve<IWorker>("TrackWorker")

        const notificationQueue = container.resolve<IQueue>("NotificationQueue")
        const notificationWorker = container.resolve<IWorker>("NotificationWorker")

        this.registerQueue(trackPollingQueue);
        this.registerWorker(trackPollingWorker);

        this.registerQueue(notificationQueue);
        this.registerWorker(notificationWorker);

        this.registerQueue(trackQueue);
        this.registerWorker(trackWorker);

        await Promise.all([
            ...this.queues.map(q => q.initialize()),
            ...this.workers.map(w => w.initialize())
        ]);
    }

    public async shutdown(): Promise<void> {
        try {
            await Promise.all([
                ...this.queues.map((queue) => queue.close()),
                ...this.workers.map((worker) => worker.close()),
            ]);

            const redis = RedisClient.getClient();
            await redis.quit();
        } catch (error) {
            console.error("Error during QueueWorkerManager shutdown:", error);
            throw error;
        }
    }
}

export default QueueWorkerManager;