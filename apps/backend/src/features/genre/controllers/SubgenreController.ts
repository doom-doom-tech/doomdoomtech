import {Request, Response} from "express";
import {formatSuccessResponse} from "../../../common/utils/responses";
import Controller from "../../../common/controllers/Controller";
import {inject, singleton} from "tsyringe";
import {Context} from "../../../common/utils/context";
import {EncodedCursorInterface} from "../../../common/types/pagination";
import {ISubgenreService} from "../services/SubgenreService";
import {SearchQueryInterface} from "../../../common/types";

export interface ISubgenreController {
	tracks(req: Request<{ subgenre: number}, {}, {}, EncodedCursorInterface>, res: Response): Promise<void>
	search(req: Request<any, any, any, SearchQueryInterface>, res: Response): Promise<void>
	filled(req: Request, res: Response): Promise<void>
}

@singleton()
class SubgenreController extends Controller implements ISubgenreController {

	constructor(
		@inject("SubgenreService") private subgenreService: ISubgenreService
	) { super() }

	public tracks = async (req: Request<{ subgenre: number}, {}, {}, EncodedCursorInterface>, res: Response) => {
		try {
			const tracks = await this.subgenreService.tracks({
				subgenreID: req.params.subgenre,
				authID: Context.get('authID'),
				cursor: req.query.cursor
			})

			res.status(200).json(formatSuccessResponse('Tracks', tracks))
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	}

	public search = async (req: Request<any, any, any, SearchQueryInterface>, res: Response) => {
		try {
			const genres = await this.subgenreService.search(req.query)
			res.status(200).json(formatSuccessResponse('Genres', genres))
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}

	public filled = async (req: Request, res: Response) => {
		try {
			res.status(200).json(formatSuccessResponse('Genres', this.subgenreService.filled))
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	}
}

SubgenreController.register()