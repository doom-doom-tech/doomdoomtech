import Service, {IServiceInterface} from "../../../common/services/Service";
import {inject, singleton} from "tsyringe";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {TrackInterface} from "../../track/types";
import PaginationHandler from "../../../common/classes/api/PaginationHandler";
import {EncodedCursorInterface, PaginationResult} from "../../../common/types/pagination";
import {Track} from "@prisma/client";
import {TrackMapper} from "../../track/mappers/TrackMapper";
import {AuthenticatedRequest} from "../../auth/types/requests";
import {GenreInterface} from "../types";
import {GenreMapper} from "../mappers/GenreMapper";
import {SearchQueryInterface} from "../../../common/types";

export interface GenreIDRequest {
	genreID: number
}

export interface FetchGenreTracksRequest extends EncodedCursorInterface, GenreIDRequest, AuthenticatedRequest
{}

export interface IGenreService extends IServiceInterface {
	all(data: SearchQueryInterface): Promise<Array<GenreInterface>>
	findParent(subgenreID: number): Promise<GenreInterface>
	filled(data: GenreIDRequest): Promise<boolean>
	tracks(data: FetchGenreTracksRequest): Promise<PaginationResult<TrackInterface>>
}

@singleton()
class GenreService extends Service implements IGenreService {

	constructor(
		@inject("Database") protected db: ExtendedPrismaClient
	) { super() }

	public async all(data: SearchQueryInterface) {
		return await this.db.genre.findMany({
			select: GenreMapper.getSelectableFields(),
			where: {
				OR: [
					{
						name: { contains: data.query, mode: 'insensitive' },
					},
					{
						subgenres: {
							some: {
								name: { contains: data.query, mode: 'insensitive' },
							}
						}
					}
				]
			}
		})
	}

	public async findParent(subgenreID: number) {
		const genre = await this.db.genre.findFirst({
			select: GenreMapper.getSelectableFields(),
			where: {
				subgenres: {
					some: {
						id: subgenreID
					}
				}
			}
		})

		return GenreMapper.format(genre)
	}

	public async tracks(data: FetchGenreTracksRequest) {
		const response = await PaginationHandler.paginate<EncodedCursorInterface, Track>({
			fetchFunction: async params => await this.db.track.paginate({
				where: {
					genreID: data.genreID
				},
				select: TrackMapper.getSelectableFields()
			}).withCursor(params),
			data: data,
			pageSize: 10,
		})

		return this.withCache(
			`genre:${data.genreID}:tracks:${data.cursor || 'start'}`,
			async () => ({
				...response,
				data: TrackMapper.formatMany(response.data)
			})
		)
	}

	public async filled(data: GenreIDRequest) {
		return Boolean(await this.db.track.count({
			where: {
				genreID: data.genreID
			}
		}))
	}
}

GenreService.register()