import {FindUserRequest, UpdateUserRequest, UpdateUserSocialsRequest, UserIDRequest} from "../types/requests";
import Controller from "../../../common/controllers/Controller";
import {inject, singleton} from "tsyringe";
import {IUserService} from "../services/UserService";
import {formatMutationResponse, formatSuccessResponse} from "../../../common/utils/responses";
import {EncodedCursorInterface} from "../../../common/types/pagination";
import {FormData, SearchQueryInterface, TODO} from "../../../common/types";
import {Request, Response} from 'express'
import {Context} from "../../../common/utils/context";
import {ITrackService} from "../../track/services/TrackService";
import {FetchRankedListRequest} from "../../../common/services/RankedListService";
import {container} from "../../../common/utils/tsyringe";
import {SocialPlatformInterface} from "../types";
import {IUserVisitService} from "../services/UserVisitService";
import _ from "lodash";

export interface IUserController {
	find(req: Request<{}, {}, FindUserRequest>, res: Response): Promise<void>;
	search(req: Request<any, any, any, SearchQueryInterface>, res: Response): Promise<void>
	latest(req: Request<any, any, any, FetchRankedListRequest>, res: Response): Promise<void>;
	labels(req: Request<any, any, any, FetchRankedListRequest>, res: Response): Promise<void>;
	current(req: Request, res: Response): Promise<void>;
	lastActive(req: Request, res: Response): Promise<void>;
	tracks(req: Request<{ userID: number }, any, any, EncodedCursorInterface & SearchQueryInterface>, res: Response): Promise<void>;
	update(req: Request<any, any, FormData<UpdateUserRequest>>, res: Response): Promise<void>;
	updateSocials(req: Request<any, any, UpdateUserSocialsRequest>, res: Response): Promise<void>;
	delete(req: Request, res: Response): Promise<void>;
	latestReleases(req: Request<any, any, any, FetchRankedListRequest>, res: Response): Promise<void>;
	visitors(req: Request<any, any, any, any, EncodedCursorInterface & SearchQueryInterface>, res: Response): Promise<void>
	suggested(req: Request<any, any, any, any, EncodedCursorInterface>, res: Response): Promise<void>
	visit(req: Request<{userID: number}>, res: Response): Promise<void>;
}

@singleton()
class UserController extends Controller implements IUserController {

	constructor(
		@inject("UserService") private userService: IUserService,
		@inject("TrackService") private trackService: ITrackService,
	) { super() }

	public find = async (req: Request<UserIDRequest, {}, FindUserRequest>, res: Response) => {
		try {
			const user = await this.userService.find({
				userID: Number(req.params.userID),
				authID: Context.get('authID')
			})

			res.status(200).json(formatSuccessResponse("User", user))
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}

	public search = async (req: Request<any, any, any, SearchQueryInterface & EncodedCursorInterface>, res: Response) => {
		try {
			res.status(200).json(
				formatSuccessResponse("Users", await this.userService.search({
					query: req.query.query ?? '',
					cursor: req.query.cursor,
					authID: Context.get('authID')
				}))
			)
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}

	public current = async (req: Request, res: Response): Promise<void> => {
		try {

			const user = await this.userService.find({
				userID: Context.get('authID'),
				authID: Context.get('authID')
			})

			res.status(200).json(formatSuccessResponse("User", user))
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}

	public latest = async (req: Request<any, any, any, FetchRankedListRequest>, res: Response<any>) => {
		try {
			const requestObject = {
				cursor: req.query.cursor,
				period: req.query.period,
				authID: Context.get('authID'),
				genreID: Number(req.query.genreID),
				subgenreID: Number(req.query.subgenreID),
			}

			const users = await this.userService.latest(requestObject)
			res.status(200).json(formatSuccessResponse('Users', users as TODO))
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}

	public labels = async (req: Request<any, any, any, FetchRankedListRequest>, res: Response<any>) => {
		try {
			const requestObject = {
				cursor: req.query.cursor,
				authID: Context.get('authID')
			}

			const labels = await this.userService.labels(requestObject)

			res.status(200).json(formatSuccessResponse('Labels', labels))
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}

	public latestReleases = async (req: Request<any, any, any, FetchRankedListRequest>, res: Response) => {
		try {
			const trackService = container.resolve<ITrackService>("TrackService")

			const response = await trackService.latest({
				cursor: req.query.cursor,
				period: req.query.period,
				authID: Context.get("authID"),
				userID: Number(req.params.userID)
			})

			res.status(200).json(formatSuccessResponse("Tracks", response));
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}

	public lastActive = async (req: Request, res: Response<any>) => {
		try {
			if(Context.get('authID') === 0) return
			await this.userService.lastActive(Context.get('authID'))
			res.status(200).json({ message: 'Activity updated' })
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}

	public suggested = async (req: Request<any, any, any, EncodedCursorInterface>, res: Response<any>) => {
		try {
			const users = await this.userService.suggested(req.query)
			res.status(200).json(formatSuccessResponse('Users', users as TODO))
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}

	public popular = async (req: Request<any, any, any, FetchRankedListRequest>, res: Response<any>) => {
		try {
			const requestObject = {
				cursor: req.query,
				genreID: Number(req.query.genreID),
				authID: Context.get('authID')
			}

			const users = await this.userService.popular(requestObject)

			res.status(200).json(formatSuccessResponse('Users', users as TODO))
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}

	public tracks = async (req: Request<{userID: number}, any, any, EncodedCursorInterface & SearchQueryInterface>, res: Response) => {
		try {
			const requestObject = {
				cursor: req.query.cursor,
				query: req.query.query,
				userID: Number(req.params.userID),
				authID: Context.get('authID')
			}

			const tracks = await this.trackService.user(requestObject)
			res.status(200).json(formatSuccessResponse('Tracks', tracks))
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}

	public update = async (req: Request<any, any, FormData<UpdateUserRequest>>, res: Response) => {
		try {
			await this.userService.update({
				where: {
					id: Context.get('authID')
				},
				data: {
					bio: req.body.bio,
					username: req.body.username,
					avatar_url: req.body.avatar_url,
					banner_url: req.body.banner_url,
				}
			})

			if(req.body.socials) {
				await this.userService.updateSocials({
					authID: Context.get('authID'),
					socials: JSON.parse(req.body.socials) as Array<SocialPlatformInterface>
				})
			}

			res.status(200).json(formatMutationResponse('User updated'))
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}

	public updateSocials = async (req: Request<any, any, UpdateUserSocialsRequest>, res: Response) => {
		try {
			const requestBody  = {
				socials: req.body.socials,
				authID: Context.get('authID'),
			}

			await this.userService.updateSocials(requestBody)

			res.status(200).json(formatMutationResponse('User updated'))
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}

	public visit = async (req: Request<{userID: number}>, res: Response) => {
		 try {
			 const userVisitService = container.resolve<IUserVisitService>("UserVisitService")
			 await userVisitService.add(Number(Context.get('authID')), _.toNumber(req.params.userID))

			 res.status(200).json(formatMutationResponse('User visit added'))
		 }  catch (error: any) {
			 this.handleError(error, req, res)
		 }
	}

	public visitors = async (req: Request<any, any, any, any, EncodedCursorInterface & SearchQueryInterface>, res: Response) => {
		try {
			const userVisitService = container.resolve<IUserVisitService>("UserVisitService")

			const visitors = await userVisitService.visitors({
				authID: Context.get('authID'),
				cursor: req.query.cursor
			})

			res.status(200).json(formatSuccessResponse('Visitors', visitors))
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}

	public delete = async (req: Request, res: Response) => {
		try {
			await this.userService.delete({ authID: Context.get('authID') })
			res.status(200).json(formatMutationResponse('User deleted'))
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}
}

UserController.register()