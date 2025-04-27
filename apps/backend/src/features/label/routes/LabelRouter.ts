import {Router} from "express";
import {injectable} from "tsyringe";
import BaseRouter from "../../../common/routes/BaseRouter";
import {container} from "../../../common/utils/tsyringe";
import {ILabelController} from "../controllers/LabelController";

@injectable()
export class LabelRouter extends BaseRouter {
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
        const labelController = container.resolve<ILabelController>("LabelController");

        this.router.get('/latest', labelController.latest)
    }
}

export default LabelRouter;