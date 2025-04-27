import Singleton from "../../../common/classes/injectables/Singleton";
import {TrackIDRequest, TrackPlaytimeBatchRequest} from "../types/requests";
import {inject, singleton} from "tsyringe";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {container} from "../../../common/utils/tsyringe";
import {ITrackStatisticsService} from "./TrackStatisticsService";
import _ from "lodash";
import {ITrackMetricsService} from "./TrackMetricsService";
import {Context} from "../../../common/utils/context";
import ValidationError from "../../../common/classes/errors/ValidationError";
import {ICreditsService} from "../../credits/services/CreditsService";

export interface ITrackActionService {
    processPlayRequest(data: TrackIDRequest): Promise<void>
    processViewRequest(data: TrackIDRequest): Promise<void>
    processStreamRequest(data: TrackIDRequest): Promise<void>
    processPlaytimeBatch(data: TrackIDRequest & TrackPlaytimeBatchRequest): Promise<void>
}

@singleton()
class TrackActionService extends Singleton implements ITrackActionService {

    constructor(
        @inject("Database") private db: ExtendedPrismaClient
    ) { super() }

    public processStreamRequest = async (data: TrackIDRequest) => {
        await this.db.$transaction(async (client) => {
            const db = client as ExtendedPrismaClient

            const sessionID = Context.get('sessionID')

            if(await this.redis.sismember(`${sessionID}:streams`, data.trackID)) {
                throw new ValidationError('Stream already processed in this session')
            }

            const trackStatisticsService = container
                .resolve<ITrackStatisticsService>('TrackStatisticsService')
                .bindTransactionClient(db)

            const trackMetricService = container
                .resolve<ITrackMetricsService>('TrackMetricsService')
                .bindTransactionClient(db)

            const currentStatistics = await trackStatisticsService
                .find(data.trackID, new Date())

            const currentMetrics = await trackMetricService
                .find(data.trackID)

            await trackStatisticsService
                .update(data.trackID, new Date(), {
                    total_streams: _.get(currentStatistics, 'total_streams', 0) + 1
                })

            await trackMetricService
                .update(data.trackID, {
                    total_streams:  _.get(currentMetrics, 'total_streams', 0) + 1
                })

            await this.assignCreditsForStreamCounts(_.get(currentMetrics, 'total_streams', 0), db)

            await this.redis.sadd(`${sessionID}:streams`, data.trackID)
        })
    }

    public async processViewRequest(data: TrackIDRequest) {
        await this.db.$transaction(async (client) => {
            const db = client as ExtendedPrismaClient

            const sessionID = Context.get('sessionID')

            if(await this.redis.sismember(`${sessionID}:views`, data.trackID)) {
                return
            }

            const trackStatisticsService = container
                .resolve<ITrackStatisticsService>('TrackStatisticsService')
                .bindTransactionClient(db)

            const trackMetricService = container
                .resolve<ITrackMetricsService>('TrackMetricsService')
                .bindTransactionClient(db)

            const currentStatistics = await trackStatisticsService
                .find(data.trackID, new Date())

            const currentMetrics = await trackMetricService
                .find(data.trackID)

            await trackStatisticsService
                .update(data.trackID, new Date(), {
                    total_views: _.get(currentStatistics, 'total_views', 0) + 1
                })

            await trackMetricService
                .update(data.trackID, {
                    total_views:  _.get(currentMetrics, 'total_views', 0) + 1
                })

            await this.redis.sadd(`${sessionID}:views`, data.trackID)
        })
    }

    public async processPlayRequest(data: TrackIDRequest) {
        await this.db.$transaction(async (client) => {
            const db = client as ExtendedPrismaClient

            const sessionID = Context.get('sessionID')

            if(await this.redis.sismember(`${sessionID}:plays`, data.trackID)) {
                throw new ValidationError('Play already processed in this session')
            }

            const trackStatisticsService = container
                .resolve<ITrackStatisticsService>('TrackStatisticsService')
                .bindTransactionClient(db)

            const trackMetricService = container
                .resolve<ITrackMetricsService>('TrackMetricsService')
                .bindTransactionClient(db)

            const currentStatistics = await trackStatisticsService
                .find(data.trackID, new Date())

            const currentMetrics = await trackMetricService
                .find(data.trackID)

            await trackStatisticsService
                .update(data.trackID, new Date(), {
                    total_plays: _.get(currentStatistics, 'total_plays', 0) + 1
                })

            await trackMetricService
                .update(data.trackID, {
                    total_plays:  _.get(currentMetrics, 'total_plays', 0) + 1
                })

            await this.redis.sadd(`${sessionID}:plays`, data.trackID)
        })
    }

    public async processPlaytimeBatch(data: TrackIDRequest & TrackPlaytimeBatchRequest) {
        await this.db.$transaction(async (client) => {
            const db = client as ExtendedPrismaClient

            const trackStatisticsService = container
                .resolve<ITrackStatisticsService>('TrackStatisticsService')
                .bindTransactionClient(db)

            const trackMetricService = container
                .resolve<ITrackMetricsService>('TrackMetricsService')
                .bindTransactionClient(db)

            const currentStatistics = await trackStatisticsService
                .find(data.trackID, new Date())

            const currentMetrics = await trackMetricService
                .find(data.trackID)

            await trackStatisticsService
                .update(data.trackID, new Date(), {
                    total_playtime: _.get(currentStatistics, 'total_playtime', 0) + data.amount
                })

            await trackMetricService
                .update(data.trackID, {
                    total_playtime:  _.get(currentMetrics, 'total_playtime', 0) + data.amount
                })
        })
    }

    private async assignCreditsForStreamCounts(totalStreams: number, db: ExtendedPrismaClient) {
        const creditsService = container
            .resolve<ICreditsService>("CreditsService")
            .bindTransactionClient(db)

        let amount = 0

        switch (true) {
            default: amount = 0.01; break;
            case totalStreams === 9: amount = 0.1; break;
            case totalStreams === 99: amount = 1; break;
            case totalStreams === 999: amount = 10; break;
            case totalStreams === 9999: amount = 100; break;
            case totalStreams === 99999: amount = 1000; break;
        }

        await creditsService.add({
            userID: Context.get('authID'),
            amount
        })
    }
}

TrackActionService.register()