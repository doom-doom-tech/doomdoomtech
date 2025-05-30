import {Router} from "express";
import {container, injectable} from "tsyringe";
import BaseRouter from "../../../common/routes/BaseRouter";
import {IUploadController} from "../controllers/UploadController";

@injectable()
export class UploadRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.initializeRoutes();
    }

    public getRouter() {
        return this.router;
    }

    public async initializeRoutes() {
        // Lazy resolve controllers
        const uploadController = container.resolve<IUploadController>("UploadController");

        this.router.get('/latest',
            uploadController.latest
        );

        this.router.post('/remove',
            uploadController.remove
        );
    }
}