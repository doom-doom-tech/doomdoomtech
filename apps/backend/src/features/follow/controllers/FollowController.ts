import {Request, Response} from "express";
import {formatSuccessResponse} from "../../../common/utils/responses";
import {EncodedCursorInterface} from "../../../common/types/pagination";
import _ from "lodash";
import {IFollowService} from "../services/FollowService";
import Controller from "../../../common/controllers/Controller";
import {inject, singleton} from "tsyringe";
import {UserIDRequest} from "../../user/types/requests";
import {Context} from "../../../common/utils/context";
import {FollowManyRequest, FollowRequest} from "../types/requests";

export interface IFollowController {
	many(req: Request<{}, {}, FollowManyRequest>, res: Response): Promise<void>;
	follow(req: Request<{}, {}, FollowRequest>, res: Response): Promise<void>;
	unfollow(req: Request<{}, {}, FollowRequest>, res: Response): Promise<void>;
	followers(req: Request<UserIDRequest, any, any, EncodedCursorInterface>, res: Response): Promise<void>;
	followees(req: Request<UserIDRequest, any, any, EncodedCursorInterface>, res: Response): Promise<void>;
}

@singleton()
class FollowController extends Controller implements IFollowController {

	constructor(
		@inject("FollowService") private followService: IFollowService
	) { super() }

	public followers = async (req: Request<UserIDRequest, any, any, EncodedCursorInterface>, res: Response) => {
		try {
			const requestObject = {
				authID: Context.get('authID'),
				userID: req.params.userID ? _.toNumber(req.params.userID) : res.locals.user.id,
				cursor: req.query.cursor
			}

			const response = await this.followService.followers(requestObject)

			res.status(200).json(formatSuccessResponse('Followers', response))
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}

	public followees = async (req: Request<UserIDRequest, any, any, EncodedCursorInterface>, res: Response) => {
		try {
			const requestObject = {
				authID: Context.get('authID'),
				userID: req.params.userID ? _.toNumber(req.params.userID) : 0,
				cursor: req.query.cursor
			}

			const response = await this.followService.followees(requestObject)

			res.status(200).json(formatSuccessResponse('Followees', response))
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}

	public follow = async (req: Request<any, any, FollowRequest>, res: Response)=> {
		try {
			await this.followService.follow({ userID: req.body.userID, authID: Context.get('authID') })
			res.status(200).json({ message: 'User followed' })
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}

	public many = async (req: Request<any, any, FollowManyRequest>, res: Response)=> {
		try {
			for(let user of req.body.users) {
				await this.followService.follow({ userID: Number(user), authID: Context.get('authID') })
			}

			res.status(200).json({ message: 'User followed' })
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}

	public unfollow = async (req: Request<any, any, FollowRequest>, res: Response)=> {
		try {
			await this.followService.unfollow({ userID: req.body.userID, authID: Context.get('authID') })
			res.status(200).json({ message: 'User unfollowed' })
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}
}

FollowController.register()