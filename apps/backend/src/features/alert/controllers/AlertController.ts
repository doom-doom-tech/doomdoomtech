import {Request, Response} from "express";
import {formatMutationResponse, formatSuccessResponse} from "../../../common/utils/responses";
import {EncodedCursorInterface} from "../../../common/types/pagination";
import {inject, singleton} from "tsyringe";
import AlertService from "../services/AlertService";
import Controller from "../../../common/controllers/Controller";
import {Context} from "../../../common/utils/context";

export interface IAlertController {
	count(req: Request, res: Response): Promise<void>;
	get(req: Request<any, any, any, EncodedCursorInterface>, res: Response): Promise<void>;
	read(req: Request, res: Response): Promise<void>;
}

@singleton()
class AlertController extends Controller implements IAlertController {
	constructor(
		@inject("AlertService") private alertService: AlertService
	) {
		super();
	}

	public count = async (req: Request, res: Response) => {
		try {
			const count = await this.alertService.count(Context.get('authID'));
			res.status(200).json(formatSuccessResponse("Count", count));
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	};

	public get = async (req: Request<any, any, any, EncodedCursorInterface>, res: Response
	) => {
		try {
			const requestObject = {
				cursor: req.query.cursor,
				authID: Context.get('authID')
			};

			const response = await this.alertService.get(requestObject);
			res.status(200).json(formatSuccessResponse("Alerts", response));
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	};

	public read = async (req: Request, res: Response) => {
		try {
			await this.alertService.read({ authID: res.locals.user.id });
			res.status(200).json(formatMutationResponse("Alerts read"));
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	};
}

AlertController.register()