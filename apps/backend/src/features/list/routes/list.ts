import {Router} from "express";
import {injectable} from "tsyringe";
import BaseRouter from "../../../common/routes/BaseRouter";
import {container} from "../../../common/utils/tsyringe";
import Authorized from "../../auth/middleware/Authorized";
import {IListTrackController} from "../controllers/ListController";

@injectable()
export class ListRouter extends BaseRouter {
	public router: Router;

	constructor() {
		super();
		this.router = Router();
		this.initializeRoutes();
	}

	public static register(): void {
		container.register("ListRouter", { useClass: ListRouter });
	}

	public getRouter(): Router {
		return this.router;
	}

	protected initializeRoutes(): void {
		const listTrackController = container.resolve<IListTrackController>("ListTrackController")

		this.router.get(
			'/count',
			Authorized,
			listTrackController.count
		)

		this.router.post(
			'',
			Authorized,
			listTrackController.add
		);

		this.router.post(
			'/update',
			Authorized,
			listTrackController.update
		);

		this.router.delete(
			'/track',
			Authorized,
			listTrackController.remove
		);

		this.router.get(
			'/:listID/tracks',
			listTrackController.tracks
		);
	}
}

// Export the class but don't register immediately
export default ListRouter;