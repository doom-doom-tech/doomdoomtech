import Service, {IServiceInterface} from "../../../common/services/Service";
import {container} from "../../../common/utils/tsyringe";
import {ITrackStatisticsService} from "./TrackStatisticsService";
import {Track} from "@prisma/client";
import {TrackPeriod} from "../../../common/utils/utilities";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {inject, singleton} from "tsyringe";
import {TrackIDRequest} from "../types/requests";
import {ILikeService} from "../../like/services/LikeService";

export interface ITrackScoringService extends IServiceInterface {
	computeBestRatedScore(): Promise<void>
	computePopularityScore(): Promise<void>
	create(data: TrackIDRequest): Promise<void>
}

const periods: Array<TrackPeriod> = [7, 24, 30, 'infinite']

const translatedPeriod: Record<TrackPeriod, string> = {
	'7': 'week',
	'24': 'day',
	'30': 'month',
	'infinite': 'overall'
}

@singleton()
class TrackScoringService extends Service implements ITrackScoringService {

	constructor(@inject("Database") protected db: ExtendedPrismaClient) {
		super();
	}

	public async create(data: TrackIDRequest) {
		await this.db.trackScore.create({
			data: {
				trackID: data.trackID,
			}
		})
	}

	public async computeBestRatedScore() {
		const trackStatisticsService = container.resolve<ITrackStatisticsService>("TrackStatisticsService");

		const computableTracks = await this.findComputableTracks();

		for (let track of computableTracks) {
			for (let period of periods) {
				const aggregatedData = await trackStatisticsService.aggregatedPeriod({
					trackID: track.id,
					period: period,
				});

				const engagementRatio = aggregatedData.total_views === 0
					? 0
					: aggregatedData.total_plays / aggregatedData.total_views;

				const averagePlaytime = aggregatedData.total_playtime === 0
					? 0
					: aggregatedData.average_playtime / aggregatedData.total_playtime;

				let periodicScore = 0;
				periodicScore += engagementRatio * 6.7;
				periodicScore += aggregatedData.average_likes_amount * 2;
				periodicScore += (aggregatedData.total_playtime / 60) * 7.2;
				periodicScore += averagePlaytime * 7.2;
				periodicScore += track.cover_url?.includes('mp4') ? 7.5 : 0;

				// Ensure periodicScore is a valid number
				const finalScore = Number.isNaN(periodicScore) ? 0 : periodicScore;

				await this.db.trackScore.updateMany({
					where: {
						trackID: track.id,
					},
					data: {
						[translatedPeriod[period]]: finalScore,
					},
				});

				console.log(`${period} score updated for track ${track.id} with score ${finalScore}`);
			}
		}
	}

	public async computePopularityScore() {
		const trackStatisticsService = container.resolve<ITrackStatisticsService>("TrackStatisticsService");
		const likeService = container.resolve<ILikeService>("LikeService")

		const computableTracks = await this.findComputableTracks()

		for(let track of computableTracks) {

			const scores: Record<TrackPeriod, number> = {} as any

			for (let period of periods) {
				let periodicScore = 0

				const aggregatedData = await trackStatisticsService.aggregatedPeriod({
					trackID: track.id,
					period: period
				})

				const aggregatedLikes = await likeService.getUniqueLikesForPeriod({
					trackID: track.id,
					period: period
				})

				periodicScore += aggregatedData.total_lists * 8.5
				periodicScore += aggregatedData.total_comments * 8.5
				periodicScore += aggregatedData.total_ratings * 5
				periodicScore += aggregatedData.total_shares * 9
				periodicScore += aggregatedData.total_views * 4
				periodicScore += aggregatedData.total_streams  * 7.5
				periodicScore += (aggregatedData.total_playtime / 60) * 7.2
				periodicScore += aggregatedLikes * 6.5


				await this.db.trackPopularity.updateMany({
					where: {
						trackID: track.id,
					},
					data: {
						[translatedPeriod[period]]: periodicScore
					}
				})

				console.log(`${period} popularity updated for track ${track.id}`)
			}
		}
	}

	private async findComputableTracks(): Promise<Array<Track>> {
		return await this.db.track.findMany({
			where: {
				active: true
			}
		})
	}
}

TrackScoringService.register()