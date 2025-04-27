import {Router} from "express";
import {inject, injectable} from "tsyringe";
import BaseRouter from "../../../common/routes/BaseRouter";
import {container} from "../../../common/utils/tsyringe";
import {IStreamController} from "../controllers/StreamController";

@injectable()
export class StreamRouter extends BaseRouter {
    public router: Router;

    constructor(
        @inject("StreamController") private streamController: IStreamController
    ) {
        super();
        this.router = Router();
        this.initializeRoutes();
    }

    public static register(): void {
        container.register("StreamRouter", { useClass: StreamRouter });
    }

    public getRouter(): Router {
        return this.router;
    }

    protected initializeRoutes(): void {
        
        
        this.router.get('/stream/:uuid', this.streamController.streamMedia);
    }
}