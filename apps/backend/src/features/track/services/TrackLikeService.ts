import Service, {IServiceInterface} from "../../../common/services/Service";
import {LikeTrackRequest} from "../types/requests";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {inject, singleton} from "tsyringe";
import {ITrackStatisticsService} from "./TrackStatisticsService";
import {container} from "../../../common/utils/tsyringe";
import _ from "lodash";
import {ITrackService} from "./TrackService";
import {Context} from "../../../common/utils/context";
import {INotificationService} from "../../notification/services/NotificationService";
import {ITrackMetricsService} from "./TrackMetricsService";
import {ILikeService} from "../../like/services/LikeService";

export interface ITrackLikeService extends IServiceInterface {
    like(data: LikeTrackRequest): Promise<void>
}

@singleton()
class TrackLikeService extends Service implements ITrackLikeService {

    constructor(
        @inject("Database") protected readonly db: ExtendedPrismaClient
    ) { super() }

    public async like(data: LikeTrackRequest) {
        await this.db.$transaction(async (client) => {
            const db = client as ExtendedPrismaClient

            /**
             * Create the Like entity to keep track of the liked status of a track
             */
            const likeService = container
                .resolve<ILikeService>("LikeService")
                .bindTransactionClient(db)

            await likeService
                .like({
                    entity: "Track",
                    amount: data.amount,
                    entityID: data.trackID,
                    authID: Context.get('authID')
                })

            /**
             * Fetch the related track to get the artists
             */
            const trackService = container
                .resolve<ITrackService>('TrackService')
                .bindTransactionClient(db);

            const track = await trackService
                .find({ trackID: data.trackID, authID: Context.get('authID') })

            /**
             * Increment the track statistics for today
             */
            const trackStatisticsService = container
                .resolve<ITrackStatisticsService>('TrackStatisticsService')
                .bindTransactionClient(db);

            const currentStatistics = await trackStatisticsService
                .find(data.trackID, new Date());

            await trackStatisticsService
                .update(data.trackID, new Date(), {
                    total_likes: _.get(currentStatistics, 'total_likes', 0) + data.amount,
                    total_ratings: _.get(currentStatistics, 'total_ratings', 0) + 1,
                })

            /**
             * Increment the metrics
             */
            const trackMetricService = container
                .resolve<ITrackMetricsService>("TrackMetricsService").bindTransactionClient(db);

            const currentMetrics = await trackMetricService
                .find(data.trackID)

            await trackMetricService
                .update(data.trackID,  {
                    total_likes: _.get(currentMetrics, 'total_likes', 0) + data.amount,
                    total_ratings: _.get(currentMetrics, 'total_ratings', 0) + 1,
                })
        })
    }
}


TrackLikeService.register()