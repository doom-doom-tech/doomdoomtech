import {Router} from "express";
import {injectable} from "tsyringe";
import {ISocialLoginController} from "../controllers/SocialLoginController";
import BaseRouter from "../../../common/routes/BaseRouter";
import {container} from "../../../common/utils/tsyringe";

@injectable()
export class SocialLoginRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.initializeRoutes();
    }

    public static register(): void {
        container.register("SocialLoginRouter", { useClass: SocialLoginRouter });
    }

    public getRouter(): Router {
        return this.router;
    }

    protected initializeRoutes(): void {
        // Lazy resolve the controller and directly call its methods
        const socialLoginController = container.resolve<ISocialLoginController>("SocialLoginController");

        this.router.post('/google', socialLoginController.google);
        this.router.post('/apple', socialLoginController.apple);
    }
}

export default SocialLoginRouter;