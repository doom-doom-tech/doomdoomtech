import {Router} from "express";
import {injectable} from "tsyringe";
import BaseRouter from "../../../common/routes/BaseRouter";
import {container} from "../../../common/utils/tsyringe";
import WebhookAuthorized from "../middleware/WebhookAuthorized";
import {ITrackUpdateController} from "../../track/controllers/TrackUpdateController";
import {IMediaUpdateController} from "../../media/controllers/MediaUpdateController";
import {IUserUpdateController} from "../../user/controllers/UserUpdateController";

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
        const mediaUpdateController = container.resolve<IMediaUpdateController>("MediaUpdateController");
        const trackUpdateController = container.resolve<ITrackUpdateController>("TrackUpdateController");
        const userUpdateController = container.resolve<IUserUpdateController>("UserUpdateController");

        // Track update routes
        this.router.post('/track/update-media', WebhookAuthorized, mediaUpdateController.updateMediaSource);
        this.router.post('/track/update-video', WebhookAuthorized, trackUpdateController.updateVideoSource);
        this.router.post('/track/update-cover', WebhookAuthorized, trackUpdateController.updateCoverSource);

        // User update routes
        this.router.post('/user/update-avatar', WebhookAuthorized, userUpdateController.updateAvatarUrl);
        this.router.post('/user/update-banner', WebhookAuthorized, userUpdateController.updateBannerUrl);
    }
}
