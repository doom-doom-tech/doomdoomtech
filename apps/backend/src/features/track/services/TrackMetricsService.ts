import Singleton from "../../../common/classes/injectables/Singleton";
import {inject, singleton} from "tsyringe";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {Prisma} from "@prisma/client";
import {IServiceInterface} from "../../../common/services/Service";

export interface TrackMetricsInterface {
    total_lists: number
    total_likes: number
    total_views: number
    total_plays: number
    total_shares: number
    total_ratings: number
    total_streams: number
	total_comments: number
    total_playtime: number
    average_list_position: number
}

export interface ITrackMetricsService extends IServiceInterface  {
    find(trackID: number): Promise<TrackMetricsInterface | null>
    update(trackID: number, data: Partial<Prisma.TrackMetricsCreateInput>): Promise<void>
}

@singleton()
class TrackMetricsService extends Singleton implements ITrackMetricsService {

    constructor(
        @inject("Database") private db: ExtendedPrismaClient
    ) { super() }

    public async find(trackID: number) {
        return this.withCache(
            `tracks:${trackID}:metrics`,
            async () => await this.db.trackMetrics.findFirst({
                where: {
                    trackID: trackID
                }
            })
        )
    }

    public async update(trackID: number, data: Partial<Prisma.TrackMetricsCreateInput>) {
        await this.db.trackMetrics.upsert({
            where: {
                trackID: trackID
            },
            create: {
                track: { connect: { id: trackID } },
                ...data,
            },
            update: {
                ...data,
            }
        });

        await this.deleteFromCache(`tracks:${trackID}:metrics`);
    }
}

TrackMetricsService.register()