import {Router} from "express";
import {inject, injectable} from "tsyringe";
import Authorized from "../../auth/middleware/authorized";
import {IAlertController} from "../controllers/AlertController";
import BaseRouter from "../../../common/routes/BaseRouter";
import {EncodedCursorInterface} from "../../../common/types/pagination";
import {container} from "../../../common/utils/tsyringe";

@injectable()
export class AlertRouter extends BaseRouter {
	public router: Router;

	constructor() {
		super();
		this.router = Router();
		this.initializeRoutes();
	}

	public static register(): void {
		container.register("AlertRouter", { useClass: AlertRouter });
	}

	public getRouter(): Router {
		return this.router;
	}

	protected initializeRoutes(): void {
		const alertController = container.resolve<IAlertController>("AlertController");

		this.router.get<any, any, any, EncodedCursorInterface>(
			'/',
			Authorized,
			alertController.get
		);

		this.router.get(
			'/count',
			Authorized,
			alertController.count
		);
	}
}