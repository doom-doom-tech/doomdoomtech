import {NextFunction, Request, Response} from "express";
import Controller from "../../../common/controllers/Controller";
import {container, singleton} from "tsyringe";
import {ICollabRequestService} from "../services/CollabRequestService";
import {Context} from "../../../common/utils/context";
import {formatMutationResponse} from "../../../common/utils/responses";

export interface ICollabController {
	accept(req: Request, res: Response, next: NextFunction): Promise<void>;
	decline(req: Request, res: Response, next: NextFunction): Promise<void>;
}

@singleton()
class CollabController extends Controller implements ICollabController {

	constructor() {
		super();
	}

	public accept = async (req: Request, res: Response) => {
		try {
			const collabRequestService = container.resolve<ICollabRequestService>("CollabRequestService");

			const requestBody = {
				trackID: req.body.trackID,
				authID: Context.get('authID')
			};

			await collabRequestService.accept(requestBody);

			res.status(200).json(formatMutationResponse("Collab request accepted"));
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	};

	public decline = async (req: Request, res: Response) => {
		try {
			const collabRequestService = container.resolve<ICollabRequestService>("CollabRequestService");

			const requestBody = {
				trackID: req.body.trackID,
				authID: Context.get('authID')
			};

			await collabRequestService.decline(requestBody);

			res.status(200).json(formatMutationResponse("Collab request declined"));
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	};
}

CollabController.register()

export default CollabController;