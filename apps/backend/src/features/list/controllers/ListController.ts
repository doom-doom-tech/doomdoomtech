import {Request, Response} from "express";
import {IListService} from "../services/ListService";
import {formatMutationResponse, formatSuccessResponse} from "../../../common/utils/responses";
import Controller from "../../../common/controllers/Controller";
import {inject, singleton} from "tsyringe";
import {Context} from "../../../common/utils/context";
import {AddListTrackRequest, BulkUpdateListTrackRequest, DeleteListTrackRequest, FetchListTracksRequest, MutateListTracksRequest} from "../types/requests";
import {container} from "../../../common/utils/tsyringe";
import {IListTrackService} from "../services/ListTrackService";
import {UserIDRequest} from "../../user/types/requests";

export interface IListTrackController {
	add(req: Request<any, any, AddListTrackRequest>, res: Response): Promise<void>
	tracks(req: Request<UserIDRequest, any, any, FetchListTracksRequest>, res: Response): Promise<void>
	remove(req: Request<any, any, DeleteListTrackRequest>, res: Response): Promise<void>
	update(req: Request<any, any, MutateListTracksRequest>, res: Response): Promise<void>
	count(req: Request<any, any, MutateListTracksRequest>, res: Response): Promise<void>
}

@singleton()
class ListTrackController extends Controller implements IListTrackController {

	public constructor(
		@inject("ListService") private listService: IListService
	) { super() }

	public count = async (req: Request, res: Response) => {
		try {
			const listTrackService = container.resolve<IListTrackService>("ListTrackService")

			const count = await listTrackService.count(Context.get('authID'));
			res.status(200).json(formatSuccessResponse("Count", count));
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	};

	public tracks = async (req: Request<UserIDRequest, any, any, FetchListTracksRequest>, res: Response) => {
		try {
			const requestObject = {
				authID: Context.get('authID'),
				userID: Number(req.params.userID),
				cursor: req.query.cursor
			}

			const tracks = await this.listService.tracks(requestObject)
			res.status(200).json(formatSuccessResponse('Tracks', tracks))
		} catch(error: any) {
			this.handleError(error, req, res)
		}
	}

	public add = async (req: Request<any, any, AddListTrackRequest>, res: Response) => {
		try {
			const listTrackService = container.resolve<IListTrackService>("ListTrackService")
			await listTrackService.add(req.body)
			res.status(200).json(formatMutationResponse('Track added to list'))
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}

	public update = async (req: Request<any, any, BulkUpdateListTrackRequest>, res: Response) => {
		try {
			const listTrackService = container.resolve<IListTrackService>("ListTrackService")
			await listTrackService.bulkUpdatePositions(req.body)
			res.status(200).json(formatMutationResponse('Track added to list'))
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}

	public remove = async (req: Request<any, any, DeleteListTrackRequest>, res: Response) => {
		try {
			const listTrackService = container.resolve<IListTrackService>("ListTrackService")
			await listTrackService.remove(req.body)
			res.status(200).json(formatMutationResponse('Track removed from list'))
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}
}

ListTrackController.register()