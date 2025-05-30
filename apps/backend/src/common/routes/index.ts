import {Router} from 'express';
import {container, injectable, Lifecycle} from "tsyringe";
import {IBaseRouter} from "./BaseRouter";
import ContextHandler from "../middleware/context";
import {IAlgoliaController} from "../controllers/AlgoliaController";
import authorized from "../../features/auth/middleware/Authorized";

export interface IMainRouter {
    getRouter(): Router;
}

@injectable()
class MainRouter implements IMainRouter {
    private router = Router();

    // List of routers to auto-register
    private readonly routes: { path: string; identifier: string }[] = [
        { path: '/bug', identifier: "BugReportRouter" },
        { path: '/auth', identifier: "AuthRouter" },
        { path: '/feed', identifier: "FeedRouter" },
        { path: '/user', identifier: "UserRouter" },
        { path: '/note', identifier: "NoteRouter" },
        { path: '/like', identifier: "LikeRouter" },
        { path: '/list', identifier: "ListRouter" },
        { path: '/media', identifier: "MediaRouter" },
        { path: '/label', identifier: "LabelRouter" },
        { path: '/genre', identifier: "GenreRouter" },
        { path: '/track', identifier: "TrackRouter" },
        { path: '/album', identifier: "AlbumRouter" },
        { path: '/alert', identifier: "AlertRouter" },
        { path: '/upload', identifier: "UploadRouter" },
        { path: '/follow', identifier: "FollowRouter" },
        { path: '/device', identifier: "DeviceRouter" },
        { path: '/report', identifier: "ReportRouter" },
        { path: '/session', identifier: "SessionRouter" },
        { path: '/webhooks', identifier: "WebhookRouter" },
        { path: '/comments', identifier: "CommentRouter" },
        { path: '/collab', identifier: "CollabRequestRouter" },
        { path: '/subscription', identifier: "SubscriptionRouter" },
        { path: '/conversation', identifier: "ConversationRouter" },
    ];

    constructor() {
        this.initializeRoutes();
    }

    public static register(): void {
        container.register("MainRouter", { useClass: MainRouter }, { lifecycle: Lifecycle.ResolutionScoped });
    }

    public getRouter(): Router {
        return this.router;
    }

    private initializeRoutes(): void {
        const algoliaController = container.resolve<IAlgoliaController>("AlgoliaController");

        this.router.use(ContextHandler);

        this.router.post(
            '/personalize',
            authorized,
            algoliaController.personalize
        )

        this.router.post(
            '/event',
            algoliaController.pushEvent
        )

        this.routes.forEach(({ path, identifier }) => {
            const routerInstance = container.resolve<IBaseRouter>(identifier);
            this.router.use(path, routerInstance.getRouter());
        });
    }
}

export default MainRouter;
