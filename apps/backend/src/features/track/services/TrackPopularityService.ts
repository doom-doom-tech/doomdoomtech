import Service, {IServiceInterface} from "../../../common/services/Service";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {inject, singleton} from "tsyringe";
import {Prisma} from "@prisma/client";

export interface ITrackPopularityService extends IServiceInterface {
    create(data: Prisma.TrackPopularityCreateArgs['data']): Promise<void>
}

@singleton()
class TrackPopularityService extends Service implements ITrackPopularityService {

    constructor(
        @inject("Database") protected db: ExtendedPrismaClient
    ) { super() }

    public create = async (data: Prisma.TrackPopularityCreateArgs['data']) => {
        await this.db.trackPopularity.create({
            data
        })
    }
}

TrackPopularityService.register()