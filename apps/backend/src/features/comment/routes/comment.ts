import {Router} from "express";
import {injectable} from "tsyringe";
import BaseRouter from "../../../common/routes/BaseRouter";
import createDynamicRateLimiter from "../../../common/middleware/limiter";
import {formatErrorResponse} from "../../../common/utils/responses";
import {container} from "../../../common/utils/tsyringe";
import {ICommentController} from "../controllers/CommentController";
import Authorized from "../../auth/middleware/Authorized";

@injectable()
export class CommentRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.initializeRoutes();
    }

    public static register(): void {
        container.register("CommentRouter", { useClass: CommentRouter });
    }

    public getRouter(): Router {
        return this.router;
    }

    protected initializeRoutes(): void {
        const commentController = container.resolve<ICommentController>("CommentController");

        const commentRateLimiter = createDynamicRateLimiter({
            windowMs: 60 * 60 * 1000,
            limit: 100,
            handler: (_req, res) => {
                res.status(429).json(formatErrorResponse('You can only post 100 comments every hour'));
            }
        }) as any

        this.router.post(
            '/',
            Authorized,
            commentRateLimiter,
            commentController.create
        );

        this.router.get(
            '/:commentID/replies',
            commentController.replies
        );

        this.router.get(
            '/:commentID/delete',
            Authorized,
            commentController.delete
        );

        this.router.get(
            '/:entity/:entityID',
            commentController.find
        )
    }
}

export default CommentRouter;