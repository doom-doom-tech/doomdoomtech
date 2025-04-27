import {injectable} from "tsyringe";
import BaseRouter from "../../../common/routes/BaseRouter";
import {Router} from "express";
import {container} from "../../../common/utils/tsyringe";
import Authorized from "../../auth/middleware/authorized";
import {ISessionController} from "../controllers/SessionController";

@injectable()
export class SessionRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.initializeRoutes();
    }

    public static register(): void {
        container.register("SessionRouter", { useClass: SessionRouter });
    }

    public getRouter(): Router {
        return this.router;
    }

    protected initializeRoutes(): void {
        const sessionController = container.resolve<ISessionController>("SessionController");

        this.router.post(
            '/create',
            Authorized,
            sessionController.create
        );
    }
}
