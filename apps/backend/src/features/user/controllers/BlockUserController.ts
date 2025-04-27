import {Request, Response} from "express";
import {formatMutationResponse, formatSuccessResponse} from "../../../common/utils/responses";
import Controller from "../../../common/controllers/Controller";
import {IUserBlockService} from "../services/UserBlockService";
import {inject, singleton} from "tsyringe";
import {Context} from "../../../common/utils/context";
import {UserIDRequest} from "../types/requests";

export interface IBlockController {
	blockUser(req: Request<any, any, { blockedID: number }>, res: Response): Promise<void>
	unblockUser(req: Request<any, any, { blockedID: number }>, res: Response): Promise<void>
	getBlockedUsers(req: Request<any, any, UserIDRequest>, res: Response): Promise<void>
}

@singleton()
class BlockController extends Controller implements IBlockController {

	public constructor(
		@inject("UserBlockService") private userBlockService: IUserBlockService
	) { super () }

	public blockUser = async (req: Request<any, any, { blockedID: number }>, res: Response<any>) => {
		try {
			await this.userBlockService.blockUser({
				userID: Number(req.body.blockedID),
				authID: Context.get('authID')
			});

			res.status(200).json(formatMutationResponse("User blocked"));
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}

	public unblockUser = async (req: Request<any, any, { blockedID: number }>, res: Response<any>) => {
		try {
			await this.userBlockService.unblockUser({
				userID: Number(req.body.blockedID),
				authID: Context.get('authID')
			});

			res.status(200).json(formatMutationResponse("User unblocked"));
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}

	public getBlockedUsers = async (req: Request<any, any, UserIDRequest>, res: Response<any>) => {
		try {
			const users = await this.userBlockService.getFormattedBlockedUsers({
				authID: Context.get('authID')
			});
			res.status(200).json(formatSuccessResponse('Users', users));
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}
}

BlockController.register()