import {singleton} from "tsyringe";
import cron from "node-cron";
import {container} from "../utils/tsyringe";
import {IFeedService} from "../../features/feed/services/FeedService";

@singleton()
export class CronJobService {
    private jobs: cron.ScheduledTask[] = [];

    /**
     * Schedules all cron jobs used in the application.
     * Call this once during the bootstrap process.
     */
    public scheduleJobs() {
        const dailyJob = cron.schedule("0 0 * * *", async () => {
            try {
                const feedService = container.resolve<IFeedService>("FeedService");
                await feedService.removeViewedHistory()
            } catch (err) {
                console.error("Error running daily cleanup job:", err);
            }
        });

        this.jobs.push(dailyJob);
    }

    /**
     * Stop all scheduled cron jobs. Useful during application shutdown.
     */
    public stopAllJobs() {
        for (const job of this.jobs) {
            job.stop();
        }
    }

    /**
     * Example method that resets your "viewed-feed-items" in Redis.
     * You can pull in your Redis instance or other service via constructor injection.
     */
    private async resetViewedFeedItems(): Promise<void> {
        // e.g. fetch all keys matching *:viewed-feed-items and delete them
        // or any approach you want to do here.
    }
}