import {Router} from "express";
import {injectable} from "tsyringe";
import BaseRouter from "../../../common/routes/BaseRouter";
import {container} from "../../../common/utils/tsyringe";
import {IConversationController} from "../controllers/ConversationController";

@injectable()
export class ConversationRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.initializeRoutes();
    }

    public static register(): void {
        container.register("ConversationRouter", { useClass: ConversationRouter });
    }

    public getRouter(): Router {
        return this.router;
    }

    protected initializeRoutes(): void {
        // Inject the controller once at the top
        const conversationController = container.resolve<IConversationController>("ConversationController");

        this.router.get(
            "/:conversation",
            conversationController.find
        );

        this.router.get(
            "/",
            conversationController.findMany
        );

        this.router.post(
            "/",
            conversationController.create
        );

        this.router.get(
            "/:conversation/users",
            conversationController.users
        );

        this.router.get(
            "/:conversation/messages",
            conversationController.messages
        );

        this.router.get(
            "/:conversation/unread-messages",
            conversationController.unreadMessagesCount
        );

        this.router.get(
            "/unread-count",
            conversationController.unreadConversationsCount
        );
    }
}

export default ConversationRouter;