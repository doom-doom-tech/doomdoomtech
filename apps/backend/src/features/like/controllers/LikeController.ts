import Controller from "../../../common/controllers/Controller";
import {Request, Response} from "express";
import {inject, singleton} from "tsyringe";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {ILikeService} from "../services/LikeService";
import {container} from "../../../common/utils/tsyringe";
import {MutateLikeRequest} from "../types/requests";
import {formatMutationResponse} from "../../../common/utils/responses";
import {Context} from "../../../common/utils/context";

export interface ILikeController {
	like(req: Request<any, any, any, Omit<MutateLikeRequest, 'authID'>>, res: Response): Promise<void>
	unlike(req: Request<{entityID: number}>, res: Response): Promise<void>
}

@singleton()
class LikeController extends Controller implements ILikeController {

	constructor(
		@inject("Database") protected db: ExtendedPrismaClient,
	) { super() }

	public like = async (req: Request<any, any, any, Omit<MutateLikeRequest, 'authID'>>, res: Response) => {
		try {
			const likeService = container.resolve<ILikeService>("LikeService");

			await likeService.like({
				amount: req.body.amount ?? 1,
				entity: req.body.entity,
				entityID: req.body.entityID,
				authID: Context.get("authID"),
			})

			res.status(200).json(formatMutationResponse("Entity liked"))
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}

	public unlike = async (req: Request<{entityID: number}>, res: Response) => {
		try {
			const likeService = container.resolve<ILikeService>("LikeService");

			await likeService.unlike({
				amount: req.body.amount ?? 1,
				entity: req.body.entity,
				entityID: req.body.entityID,
				authID: Context.get("authID"),
			})

			res.status(200).json(formatMutationResponse("Like removed"))
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}
}

LikeController.register()