import {Router} from "express";
import {injectable} from "tsyringe";
import BaseRouter from "../../../common/routes/BaseRouter";
import {container} from "../../../common/utils/tsyringe";
import {ISubscriptionController} from "../controllers/SubscriptionController";

@injectable()
export class SubscriptionRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.initializeRoutes();
    }

    public static register(): void {
        container.register("SubscriptionRouter", { useClass: SubscriptionRouter });
    }

    public getRouter(): Router {
        return this.router;
    }

    protected initializeRoutes(): void {
        const subscriptionController = container.resolve<ISubscriptionController>("SubscriptionController");

        this.router.get('/validate', subscriptionController.validatePremiumStatus);
    }
}