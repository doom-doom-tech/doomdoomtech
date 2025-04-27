import SearchService from "../services/SearchService";
import {Request, Response} from "express";
import {formatSuccessResponse} from "../../../common/utils/responses";
import Controller from "../../../common/controllers/Controller";
import {SearchRequestInterface} from "../types/requests";
import {singleton} from "tsyringe";

export interface ISearchController {
	tracks(req: Request<any, any, any, SearchRequestInterface>, res: Response): Promise<void>
	users(req: Request<any, any, any, SearchRequestInterface>, res: Response): Promise<void>
}

@singleton()
class SearchController extends Controller implements ISearchController {

	constructor(
		private service: SearchService
	) { super() }

	public tracks = async (req: Request<any, any, any, SearchRequestInterface>, res: Response) => {
		try {
			const response = await this.service.tracks(req.query)
			res.status(200).json(formatSuccessResponse('Results', response))
		} catch (error: any) {
			this.handleError(error, res, res)
		}
	}

	public users = async (req: Request<any, any, any, SearchRequestInterface>, res: Response) => {
		try {
			const response = await this.service.users(req.query)
			res.status(200).json(formatSuccessResponse('Results', response))
		} catch (error: any) {
			this.handleError(error, res, res)
		}
	}
}