import {Router} from "express";
import {injectable} from "tsyringe";
import BaseRouter from "../../../common/routes/BaseRouter";
import {container} from "../../../common/utils/tsyringe";
import {ITrackController} from "../controllers/TrackController";
import {ICommentController} from "../../comment/controllers/CommentController";
import Authorized from "../../auth/middleware/Authorized";
import {ValidateSession} from "../../session/middleware/ValidateSession";
import {ITrackActionController} from "../controllers/TrackActionController";
import createDynamicRateLimiter from "../../../common/middleware/limiter";
import {formatErrorResponse} from "../../../common/utils/responses";


@injectable()
export class TrackRouter extends BaseRouter {
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
        const trackController = container.resolve<ITrackController>("TrackController");
        const commentController = container.resolve<ICommentController>("CommentController");
        const trackActionController = container.resolve<ITrackActionController>("TrackActionController");

        const streamRateLimiter = createDynamicRateLimiter({
            windowMs: 60 * 1000,
            limit: 2,
            handler: (_req, res) => {
                res.status(429).json(formatErrorResponse('You can only add 2 streams every minute'));
            }
        }) as any;

        this.router.get('/search',
            trackController.search
        );

        this.router.post('/',
            Authorized,
            trackController.create
        );

        this.router.delete('/',
            Authorized,
            trackController.delete
        );

        this.router.get('/',
            trackController.all
        );

        this.router.get('/user/:userID',
            trackController.user
        );

        this.router.get('/latest',
            trackController.latest
        );

        this.router.post('/like',
            trackController.like
        );

        this.router.get('/best-rated',
            trackController.bestRated
        );

        this.router.get('/most-listened',
            trackController.mostListened
        );

        this.router.get('/latest-videos',
            trackController.latestVideos
        );

        this.router.get('/most-popular',
            trackController.mostPopular
        );

        this.router.get('/:trackID',
            trackController.find
        );

        this.router.post('/:trackID/playtime',
            Authorized,
            trackActionController.processPlaytimeBatch
        );

        this.router.post('/:trackID/stream',
            Authorized,
            ValidateSession,
            streamRateLimiter,
            // @ts-ignore
            trackActionController.processStreamRequest
        );

        this.router.post('/:trackID/play',
            Authorized,
            ValidateSession,
            trackActionController.processPlayRequest
        );

        this.router.post('/:trackID/view',
            Authorized,
            ValidateSession,
            trackActionController.processViewRequest
        );

        this.router.get('/:trackID/comments',
            commentController.find
        );

        this.router.delete('/:trackID',
            trackController.delete)
        ;
    }
}