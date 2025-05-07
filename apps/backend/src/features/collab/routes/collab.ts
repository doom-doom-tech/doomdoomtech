import {Router} from "express";
import {injectable} from "tsyringe";
import BaseRouter from "../../../common/routes/BaseRouter";
import Authorized from "../../auth/middleware/Authorized";
import {container} from "../../../common/utils/tsyringe";
import {ICollabController} from "../controllers/CollabController";

@injectable()
export class CollabRequestRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.initializeRoutes();
    }

    public static register(): void {
        container.register("CollabRequestRouter", { useClass: CollabRequestRouter });
    }

    public getRouter(): Router {
        return this.router;
    }

    protected initializeRoutes(): void {
        
        
        // Lazy resolve controller
        const collabRequestController = container.resolve<ICollabController>("CollabController");

        this.router.post('/decline', Authorized, collabRequestController.decline);
        this.router.post('/accept', Authorized, collabRequestController.accept);
    }
}

// Register immediately
CollabRequestRouter.register();

export default CollabRequestRouter;