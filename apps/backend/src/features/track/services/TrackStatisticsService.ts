import Singleton from "../../../common/classes/injectables/Singleton";
import {inject, singleton} from "tsyringe";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {FetchAggregatedTrackStatisticsRequest} from "../types/requests";
import {getDateRangeForPeriod} from "../../../common/utils/utilities";
import {Prisma} from "@prisma/client";
import {IServiceInterface} from "../../../common/services/Service";

export interface TrackStatisticsInterface {
	average_list_position: number
	average_playtime: number
	average_likes_amount: number
	total_lists: number
	total_likes: number
	total_views: number
	total_plays: number
	total_shares: number
	total_ratings: number
	total_streams: number
	total_playtime:number
	total_comments: number
}

export interface ITrackStatisticsService extends IServiceInterface {
	find(trackID: number, date: Date): Promise<TrackStatisticsInterface | null>
	update(trackID: number, date: Date, data: Partial<Prisma.TrackStatisticsCreateInput>): Promise<void>
	aggregatedPeriod(data: FetchAggregatedTrackStatisticsRequest): Promise<TrackStatisticsInterface>
}

@singleton()
class TrackStatisticsService extends Singleton implements ITrackStatisticsService {

	constructor(
		@inject("Database") private db: ExtendedPrismaClient,
	) { super()	}

	public async find(trackID: number, date: Date): Promise<TrackStatisticsInterface | null> {
		return this.withCache(
			`track:${trackID}:statistics:${date}`,
			async () => await this.aggregatedPeriod({ trackID, period: 24 })
		)
	}

	public async update(trackID: number, date: Date, data: Partial<Prisma.TrackStatisticsCreateInput>) {
		const truncatedDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

		await this.db.trackStatistics.upsert({
			where: {
				created_trackID: {
					created: truncatedDate,
					trackID: trackID,
				},
			},
			update: data,
			create: {
				track: { connect: { id: trackID } },
				created: truncatedDate,
				...data,
			},
		});

		await this.deleteFromCache(`track:${trackID}:statistics:${date}`);
	}

	public async aggregatedPeriod(data: FetchAggregatedTrackStatisticsRequest) {
		const response =  await this.db.trackStatistics.aggregate({
			_avg: {
				average_list_position: true,
				total_playtime: true,
				total_likes: true,
			},
			_sum: {
				total_comments: true,
				total_lists: true,
				total_likes: true,
				total_views: true,
				total_plays: true,
				total_shares: true,
				total_ratings: true,
				total_streams: true,
				total_playtime: true,
			},
			where: {
				trackID: data.trackID,
				created: getDateRangeForPeriod(data.period)
			},
		})

		return {
			average_list_position: response._avg.average_list_position ?? 0,
			average_playtime: response._avg.total_playtime ?? 0,
			average_likes_amount: response._avg.total_likes ?? 0,
			total_comments: response._sum.total_comments ?? 0,
			total_likes: response._sum.total_likes ?? 0,
			total_lists: response._sum.total_lists ?? 0,
			total_views: response._sum.total_views ?? 0,
			total_plays: response._sum.total_plays ?? 0,
			total_shares: response._sum.total_shares ?? 0,
			total_ratings: response._sum.total_ratings ?? 0,
			total_streams: response._sum.total_streams ?? 0,
			total_playtime: response._sum.total_playtime ?? 0,
		};
	}
}

TrackStatisticsService.register()