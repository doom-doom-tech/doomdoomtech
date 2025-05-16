import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {inject, singleton} from "tsyringe";
import Service, {IServiceInterface} from "../../../common/services/Service";
import {IUserService} from "../../user/services/UserService";
import {CreateListRequest, FetchListTracksRequest} from "../types/requests";
import {TrackInterface} from "../../track/types";
import {Context} from "../../../common/utils/context";
import {ITrackStatisticsService} from "../../track/services/TrackStatisticsService";
import {UserIDRequest} from "../../user/types/requests";
import {List} from "@prisma/client";
import {TrackMapper} from "../../track/mappers/TrackMapper";
import _ from "lodash";
import {container} from "../../../common/utils/tsyringe";
import EntityNotFoundError from "../../../common/classes/errors/EntityNotFoundError";

export interface IListService extends IServiceInterface {
	find(data: UserIDRequest): Promise<List | null>
	create(data: CreateListRequest): Promise<void>;
	tracks(data: FetchListTracksRequest): Promise<Array<TrackInterface>>;
}

@singleton()
class ListService extends Service implements IListService {

	constructor(
		@inject("Database") protected db: ExtendedPrismaClient,
		@inject("UserService") private userService: IUserService,
		@inject("TrackStatisticsService") private trackStatisticService: ITrackStatisticsService
	) { super() }

	public find = async (data: UserIDRequest): Promise<List | null> => {
		return await this.db.list.findFirst({
			where: {
				userID: data.userID,
			}
		})
	}

	public create = async (data: CreateListRequest) => {
		const user = await this.userService.find({
			userID: data.userID,
			authID: Context.get('authID')
		})

		await this.db.list.create({
			data: {
				userID: user.id
			},
		});
	};

	public tracks = async (data: FetchListTracksRequest)  => {
		const listService = container.resolve<IListService>("ListService");
		const list = await listService.find(data)

		if(!list) throw new EntityNotFoundError("List")

		const response = await this.db.listTrack.findMany({
			select: {
				id: true,
				track: {
					select: TrackMapper.getSelectableFields()
				}
			},
			where: { list: { id: list.id } },
		})
		
		if(list.userID === data.authID) {
			for(let listTrack of response) {
				await this.db.listTrack.update({
					where: {
						id: listTrack.id
					},
					data: {
						read: true
					}
				})
			}
		}

		return _.map(response, listTrack => TrackMapper.format(listTrack.track))
	};
}

export default ListService;