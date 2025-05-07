import {Router} from "express";
import {injectable} from "tsyringe";
import BaseRouter from "../../../common/routes/BaseRouter";
import {container} from "../../../common/utils/tsyringe";
import WebhookAuthorized from "../middleware/WebhookAuthorized";
import {ITrackUpdateController} from "../../track/controllers/TrackUpdateController";

@injectable()
export class WebhookRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.initializeRoutes();
    }

    public static register(): void {
        container.register("WebhookRouter", { useClass: WebhookRouter });
    }

    public getRouter(): Router {
        return this.router;
    }

    protected initializeRoutes(): void {
        const trackUpdateController = container.resolve<ITrackUpdateController>("TrackUpdateController");

        // Track update routes
        this.router.post('/track/update-video', WebhookAuthorized, trackUpdateController.updateVideoSource);
        this.router.post('/track/update-cover', WebhookAuthorized, trackUpdateController.updateCoverSource);
    }
}
