import {Router} from "express";
import {injectable} from "tsyringe";
import {IFollowController} from "../controllers/FollowController";
import BaseRouter from "../../../common/routes/BaseRouter";
import {container} from "../../../common/utils/tsyringe";
import Authorized from "../../auth/middleware/authorized";

@injectable()
export class FollowRouter extends BaseRouter {
	public router: Router;

	constructor() {
		super();
		this.router = Router();
		this.initializeRoutes();
	}

	public static register(): void {
		container.register("FollowRouter", { useClass: FollowRouter });
	}

	public getRouter(): Router {
		return this.router;
	}

	protected initializeRoutes(): void {

		const followController = container.resolve<IFollowController>("FollowController");

		this.router.post(
			'/',
			Authorized,
			followController.follow
		);

		this.router.post(
			'/many',
			Authorized,
			followController.many
		);

		this.router.post(
			'/remove',
			Authorized,
			followController.unfollow
		);
	}
}

export default FollowRouter;