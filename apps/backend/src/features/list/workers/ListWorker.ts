import Worker from "../../../common/workers/Worker";
import {Job} from "bullmq";
import {IListJobs} from "../jobs/ListJobs";
import {inject} from "tsyringe";
import Redis from "ioredis";
import {AddListTrackRequest} from "../types/requests";


class ListWorker extends Worker {

    constructor(
        @inject("ListJobs") private jobs: IListJobs,
        @inject("Redis") private readonly redis: Redis
    ) {
        super('ListQueue', redis);
    }

    protected async processJob(job: Job<AddListTrackRequest>): Promise<void> {
        switch (job.name) {
            case 'fakeListEvent':
                await this.jobs.executeFakeList(job.data);
                break;

            default:
                throw new Error(`Unknown job name: ${job.name}`);
        }
    }
}

export default ListWorker;