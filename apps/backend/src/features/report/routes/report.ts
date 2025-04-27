import {Router} from "express";
import {injectable} from "tsyringe";
import BaseRouter from "../../../common/routes/BaseRouter";
import {container} from "../../../common/utils/tsyringe";
import {IReportController} from "../controllers/ReportController";

@injectable()
export class ReportRouter extends BaseRouter {
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
        const reportController = container.resolve<IReportController>("ReportController");

        this.router.post(
            "/",
            reportController.create
        );
    }
}

export default ReportRouter;