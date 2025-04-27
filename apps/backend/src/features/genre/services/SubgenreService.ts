import Service, {IServiceInterface} from "../../../common/services/Service";
import {inject, singleton} from "tsyringe";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {TrackInterface} from "../../track/types";
import PaginationHandler from "../../../common/classes/api/PaginationHandler";
import {EncodedCursorInterface, PaginationResult} from "../../../common/types/pagination";
import {Track} from "@prisma/client";
import {TrackMapper} from "../../track/mappers/TrackMapper";
import {AuthenticatedRequest} from "../../auth/types/requests";
import {SearchQueryInterface} from "../../../common/types";
import {SubgenreInterface} from "../types";
import {SubgenreMapper} from "../mappers/SubgenreMapper";

export interface SubgenreIDRequest {
	subgenreID: number
}

export interface FetchSubgenreTracksRequest extends EncodedCursorInterface, SubgenreIDRequest, AuthenticatedRequest
{}

export interface ISubgenreService extends IServiceInterface {
	filled(data: SubgenreIDRequest): Promise<boolean>
	search(data: SearchQueryInterface): Promise<Array<SubgenreInterface>>
	tracks(data: FetchSubgenreTracksRequest): Promise<PaginationResult<TrackInterface>>
}

@singleton()
class SubgenreService extends Service implements ISubgenreService {

	constructor(
		@inject("Database") protected db: ExtendedPrismaClient
	) { super() }

	public async tracks(data: FetchSubgenreTracksRequest): Promise<PaginationResult<TrackInterface>> {
		const response = await PaginationHandler.paginate<EncodedCursorInterface, Track>({
			fetchFunction: async params => await this.db.track.paginate({
				where: {
					subgenreID: data.subgenreID
				},
				select: TrackMapper.getSelectableFields()
			}).withCursor(params),
			data: data,
			pageSize: 10,
		})

		return this.withCache(
			`subgenre:${data.subgenreID}:tracks:${data.cursor || 'start'}`,
			async () => ({
				...response,
				data: TrackMapper.formatMany(response.data)
			})
		)
	}

	public async search(data: SearchQueryInterface) {
		return await this.db.subGenre.findMany({
			select: SubgenreMapper.getSelectableFields(),
			where: {
				name: { contains: data.query, mode: 'insensitive' }
			}
		})
	}

	public async filled(data: SubgenreIDRequest) {
		return Boolean(await this.db.track.count({
			where: {
				subgenreID: data.subgenreID
			}
		}))
	}
}

SubgenreService.register()