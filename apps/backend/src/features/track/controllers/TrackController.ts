import {ITrackService} from "../services/TrackService";
import {Request, response, Response} from "express";
import Controller from "../../../common/controllers/Controller";
import {inject, singleton} from "tsyringe";
import {CreateTrackRequest, FetchTracksRequest, FetchUserTracksRequest, LikeTrackRequest, TrackIDRequest,} from "../types/requests";
import {Context} from "../../../common/utils/context";
import {formatErrorResponse, formatMutationResponse, formatSuccessResponse} from "../../../common/utils/responses";
import {FetchRankedListRequest} from "../../../common/services/RankedListService";
import {ITrackLikeService} from "../services/TrackLikeService";
import {container} from "../../../common/utils/tsyringe";
import {SearchQueryInterface} from "../../../common/types";
import {SingleUserInterface} from "../../user/types";
import ValidationError from "../../../common/classes/errors/ValidationError";
import EntityNotFoundError from "../../../common/classes/errors/EntityNotFoundError";
import {EncodedCursorInterface} from "../../../common/types/pagination";
import SocketManager from "../../../common/services/SocketManager";

export interface ITrackController {
	all(req: Request<any, any, any, FetchTracksRequest>, res: Response): Promise<void>
	find(req: Request<TrackIDRequest>, res: Response): Promise<void>;
	delete(req: Request<any, any, TrackIDRequest>, res: Response): Promise<void>;
	like(req: Request<any, any, LikeTrackRequest>, res: Response): Promise<void>
	search(req: Request<any, any, any, Required<SearchQueryInterface> & EncodedCursorInterface>, res: Response): Promise<void>;
	create(req: Request<any, any, CreateTrackRequest>, res: Response): Promise<void>;

	user(req: Request<any, any, FetchUserTracksRequest>, res: Response): Promise<void>;
	latest(req: Request<any, any, any, FetchRankedListRequest>, res: Response): Promise<void>;
	bestRated(req: Request<any, any, any, FetchRankedListRequest>, res: Response): Promise<void>;
	mostPopular(req: Request<any, any, any, FetchRankedListRequest>, res: Response): Promise<void>;
	mostListened(req: Request<any, any, any, FetchRankedListRequest>, res: Response): Promise<void>;
	latestVideos(req: Request<any, any, any, FetchRankedListRequest>, res: Response): Promise<void>;
}

@singleton()
class TrackController extends Controller implements ITrackController {

	constructor(
		@inject("TrackService") private trackService: ITrackService
	) { super() }

	public all = async (req: Request<any, any, any, FetchTracksRequest>, res: Response) => {
		try {
			const requestObject = {
				cursor: req.query.cursor,
				query: req.query.query
			}

			const response = await this.trackService.all(requestObject);
			res.status(200).json(formatSuccessResponse("Tracks", response));
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	}

	public find = async (req: Request<TrackIDRequest>, res: Response): Promise<void> => {
		try {
			const response = await this.trackService.find({
				trackID: Number(req.params.trackID),
				authID: Context.get("authID"),
			});

			res.status(200).json(formatSuccessResponse("Track", response));
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	}

	public search = async (req: Request<any, any, any, Required<SearchQueryInterface> & EncodedCursorInterface>, res: Response): Promise<void> => {
		try {
			const response = await this.trackService.search({
				query: req.query.query,
				cursor: req.query.cursor,
				authID: Context.get("authID"),
			});

			res.status(200).json(formatSuccessResponse("Tracks", response));
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	}

	public create = async (req: Request<any, any, CreateTrackRequest>, res: Response): Promise<void> => {
		try {
			const uploader = Context.get('user') as SingleUserInterface;

			const parsedRequest: CreateTrackRequest = {
				...req.body,
				authID: uploader.id,
				main_artist: uploader.id
			};

			if (!uploader.premium && parsedRequest.tags.length > 1) {
				res.status(422).json(formatErrorResponse('You cannot use more than 1 label tag as a regular user'));
				return;
			}

			const response = await this.trackService.create(parsedRequest);

			res.status(201).json(formatSuccessResponse("Track", response));
		} catch (error: any) {
			this.handleError(error, req, res);

			const socketManager = container.resolve<SocketManager>("SocketManager")
			socketManager.emitToRoom(`user_${Context.get('authID')}`, 'track:upload:error', { trackUUID: req.body.uuid })
		}
	}

	public user = async (req: Request<any, any, FetchUserTracksRequest>, res: Response): Promise<void> => {
		try {
			const response = await this.trackService.user({
				userID: req.body.userID,
				cursor: req.body.cursor,
			});

			res.status(200).json(formatSuccessResponse("User's tracks", response));
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	}

	public latest = async (req: Request<any, any, any, FetchRankedListRequest>, res: Response): Promise<void> => {
		try {
			const response = await this.trackService.latest({
				period: req.query.period,
				cursor: req.query.cursor,
				userID: req.query.userID,
				genreID: req.query.genreID,
				labelTag: req.query.labelTag,
				authID: Context.get("authID"),
				subgenreID: req.query.subgenreID,
				distinct: req.query.distinct,
			});

			res.status(200).json(formatSuccessResponse("Tracks", response));
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	}

	public bestRated = async (req: Request<any, any, any, FetchRankedListRequest>, res: Response): Promise<void> => {
		try {
			const response = await this.trackService.bestRated({
				period: req.query.period,
				cursor: req.query.cursor,
				userID: req.query.userID,
				genreID: req.query.genreID,
				labelTag: req.query.labelTag,
				authID: Context.get("authID"),
				subgenreID: req.query.subgenreID,
			});

			res.status(200).json(formatSuccessResponse("Tracks", response));
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	}

	public mostListened = async (req: Request<any, any, any, FetchRankedListRequest>, res: Response): Promise<void> => {
		try {
			const response = await this.trackService.mostListened({
				period: req.query.period,
				cursor: req.query.cursor,
				userID: req.query.userID,
				genreID: req.query.genreID,
				labelTag: req.query.labelTag,
				authID: Context.get("authID"),
				subgenreID: req.query.subgenreID,
			});

			res.status(200).json(formatSuccessResponse("Tracks", response));
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	}

	public latestVideos = async (req: Request<any, any, any, FetchRankedListRequest>, res: Response): Promise<void> => {
		try {
			const response = await this.trackService.latestVideos({
				period: req.query.period,
				cursor: req.query.cursor,
				userID: req.query.userID,
				genreID: req.query.genreID,
				labelTag: req.query.labelTag,
				authID: Context.get("authID"),
				subgenreID: req.query.subgenreID,
			});

			res.status(200).json(formatSuccessResponse("Tracks", response));
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	}

	public mostPopular = async (req: Request<any, any, any, FetchRankedListRequest>, res: Response): Promise<void> => {
		try {
			const response = await this.trackService.mostPopular({
				period: req.query.period,
				cursor: req.query.cursor,
				userID: req.query.userID,
				genreID: req.query.genreID,
				labelTag: req.query.labelTag,
				authID: Context.get("authID"),
				subgenreID: req.query.subgenreID,
			});

			res.status(200).json(formatSuccessResponse("Tracks", response));
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	}

	public delete = async (req: Request<any, any, TrackIDRequest>, res: Response): Promise<void> => {
		try {

			const relatedTrack = await this.trackService.find({
				authID: Context.get('authID'),
				trackID: Number(req.body.trackID)
			})

			if(!relatedTrack) {
				throw new EntityNotFoundError('Track');
			}

			if(relatedTrack.main_artist !== Context.get('authID')) {
				throw new ValidationError('You are not the owner of this track')
			}

			await this.trackService.delete({
				trackID: req.body.trackID,
			});

			res.status(200).json(formatSuccessResponse("Track deleted", {}));
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	}

	public like = async (req: Request<any, any, LikeTrackRequest>, res: Response): Promise<void> => {
		try {
			const trackLikeService = container.resolve<ITrackLikeService>("TrackLikeService");

			await trackLikeService.like(req.body)

			res.status(200).json(formatMutationResponse("Track liked"))
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	}
}

TrackController.register()
