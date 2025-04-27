import {Router} from "express";
import {injectable} from "tsyringe";
import BaseRouter from "../../../common/routes/BaseRouter";
import {container} from "../../../common/utils/tsyringe";
import Authorized from "../../auth/middleware/authorized";
import {ILikeController} from "../controllers/LikeController";

@injectable()
export class LikeRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.initializeRoutes();
    }

    public static register(): void {
        container.register("LikeRouter", { useClass: LikeRouter });
    }

    public getRouter(): Router {
        return this.router;
    }

    protected initializeRoutes(): void {
        // Inject the controller once
        const likeController = container.resolve<ILikeController>("LikeController");

        this.router.post(
            '/',
            Authorized,
            likeController.like
        );

        this.router.delete(
            '/',
            Authorized,
            likeController.unlike
        );
    }
}

export default LikeRouter;