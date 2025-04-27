import {Router} from 'express';
import {container, injectable, Lifecycle} from "tsyringe";
import {IBaseRouter} from "./BaseRouter";
import ContextHandler from "../middleware/context";
import {IAlgoliaController} from "../controllers/AlgoliaController";
import authorized from "../../features/auth/middleware/authorized";

export interface IMainRouter {
    getRouter(): Router;
}

@injectable()
class MainRouter implements IMainRouter {
    private router = Router();

    // List of routers to auto-register
    private readonly routes: { path: string; identifier: string }[] = [
        { path: '/alert', identifier: "AlertRouter" },
        { path: '/album', identifier: "AlbumRouter" },
        { path: '/auth', identifier: "AuthRouter" },
        { path: '/bug', identifier: "BugReportRouter" },
        { path: '/track', identifier: "TrackRouter" },
        { path: '/user', identifier: "UserRouter" },
        { path: '/note', identifier: "NoteRouter" },
        { path: '/collab', identifier: "CollabRequestRouter" },
        { path: '/comments', identifier: "CommentRouter" },
        { path: '/conversation', identifier: "ConversationRouter" },
        { path: '/device', identifier: "DeviceRouter" },
        { path: '/like', identifier: "LikeRouter" },
        { path: '/list', identifier: "ListRouter" },
        { path: '/media', identifier: "MediaRouter" },
        { path: '/feed', identifier: "FeedRouter" },
        { path: '/genre', identifier: "GenreRouter" },
        { path: '/follow', identifier: "FollowRouter" },
        { path: '/session', identifier: "SessionRouter" },
        { path: '/label', identifier: "LabelRouter" },
        { path: '/report', identifier: "ReportRouter" },
        { path: '/subscription', identifier: "SubscriptionRouter" },
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