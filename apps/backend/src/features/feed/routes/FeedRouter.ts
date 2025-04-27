import {Router} from "express";
import {injectable} from "tsyringe";
import BaseRouter from "../../../common/routes/BaseRouter";
import {container} from "../../../common/utils/tsyringe";
import {IFeedController} from "../controllers/FeedController";

@injectable()
export class FeedRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.initializeRoutes();
    }

    public getRouter() {
        return this.router;
    }

    public initializeRoutes() {
        const feedController = container.resolve<IFeedController>("FeedController");
        this.router.get("/personalized", feedController.personalized);
        this.router.get("/recommended", feedController.recommended);
        this.router.get("/following", feedController.following);
    }
}

export default FeedRouter;