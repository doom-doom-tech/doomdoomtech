import {Request, Response} from "express";
import {formatSuccessResponse} from "../../../common/utils/responses";
import {IGenreService} from "../services/GenreService";
import Controller from "../../../common/controllers/Controller";
import {inject, singleton} from "tsyringe";
import {Context} from "../../../common/utils/context";
import {EncodedCursorInterface} from "../../../common/types/pagination";
import {SearchQueryInterface} from "../../../common/types";

export interface IGenreController {
	tracks(req: Request<{ genre: number}, {}, {}, EncodedCursorInterface>, res: Response): Promise<void>
	filled(req: Request, res: Response): Promise<void>
	all(req: Request, res: Response): Promise<void>
}

@singleton()
class GenreController extends Controller implements IGenreController {

	constructor(
		@inject("GenreService") private genreService: IGenreService
	) { super() }

	public all = async (req: Request<any, any, any, SearchQueryInterface>, res: Response): Promise<void> => {
		try {
			const genres = await this.genreService.all(req.query)
			res.status(200).json(formatSuccessResponse('Genres', genres))
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}

	public tracks = async (req: Request<{ genre: number}, {}, {}, EncodedCursorInterface>, res: Response) => {
		try {
			const tracks = await this.genreService.tracks({
				genreID: req.params.genre,
				authID: Context.get('authID'),
				cursor: req.query.cursor
			})

			res.status(200).json(formatSuccessResponse('Tracks', tracks))
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	}

	public filled = async (req: Request, res: Response) => {
		try {
			res.status(200).json(formatSuccessResponse('Genres', this.genreService.filled))
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	}
}

GenreController.register()