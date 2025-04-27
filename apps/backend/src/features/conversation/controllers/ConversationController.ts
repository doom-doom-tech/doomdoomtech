import {NextFunction, Request, Response} from "express";
import {container, singleton} from "tsyringe";
import Controller from "../../../common/controllers/Controller";
import {IConversationService} from "../services/ConversationService";
import {Context} from "../../../common/utils/context";

export interface IConversationController {
    find(req: Request, res: Response, next: NextFunction): Promise<void>;
    findMany(req: Request, res: Response, next: NextFunction): Promise<void>;
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    users(req: Request, res: Response, next: NextFunction): Promise<void>;
    messages(req: Request, res: Response, next: NextFunction): Promise<void>;
    unreadMessagesCount(req: Request, res: Response, next: NextFunction): Promise<void>;
    unreadConversationsCount(req: Request, res: Response, next: NextFunction): Promise<void>;
}

@singleton()
class ConversationController extends Controller implements IConversationController {
    constructor() {
        super();
    }

    public find = async (req: Request, res: Response) => {
        try {
            const conversationService = container.resolve<IConversationService>("ConversationService");

            const conversation = await conversationService.find({
                conversationID: Number(req.params.conversation),
                authID: Context.get("authID"),
            });
            res.status(200).json({
                message: "Conversation fetched successfully",
                data: conversation,
            });
        } catch (error: any) {
            this.handleError(error, req, res);
        }
    };

    public findMany = async (req: Request, res: Response) => {
        try {
            const conversationService = container.resolve<IConversationService>("ConversationService");

            const conversations = await conversationService.findMany({
                authID: Context.get("authID"),
                cursor: req.query.cursor as string,
            });
            res.status(200).json({
                message: "Conversations fetched successfully",
                data: conversations,
            });
        } catch (error: any) {
            this.handleError(error, req, res);
        }
    };

    public create = async (req: Request, res: Response) => {
        try {
            const conversationService = container.resolve<IConversationService>("ConversationService");

            const conversation = await conversationService.create({
                authID: Context.get("authID"),
                recipientID: req.body.recipientID,
            });
            res.status(201).json({
                message: "Conversation created successfully",
                data: conversation,
            });
        } catch (error: any) {
            this.handleError(error, req, res);
        }
    };

    public users = async (req: Request, res: Response) => {
        try {
            const conversationService = container.resolve<IConversationService>("ConversationService");

            const users = await conversationService.users({
                conversationID: Number(req.params.conversation),
                authID: Context.get("authID"),
            });
            res.status(200).json({
                message: "Users fetched successfully",
                data: users,
            });
        } catch (error: any) {
            this.handleError(error, req, res);
        }
    };

    public messages = async (req: Request, res: Response) => {
        try {
            const conversationService = container.resolve<IConversationService>("ConversationService");

            const messages = await conversationService.messages({
                conversationID: Number(req.params.conversation),
                authID: Context.get("authID"),
                cursor: req.query.cursor as string,
            });
            res.status(200).json({
                message: "Messages fetched successfully",
                data: messages,
            });
        } catch (error: any) {
            this.handleError(error, req, res);
        }
    };

    public unreadMessagesCount = async (req: Request, res: Response) => {
        try {
            const conversationService = container.resolve<IConversationService>("ConversationService");

            const count = await conversationService.unreadMessagesCount({
                conversationID: Number(req.params.conversation),
                authID: Context.get("authID"),
            });
            res.status(200).json({
                message: "Unread messages count",
                data: count,
            });
        } catch (error: any) {
            this.handleError(error, req, res);
        }
    };

    public unreadConversationsCount = async (req: Request, res: Response) => {
        try {
            const conversationService = container.resolve<IConversationService>("ConversationService");

            const count = await conversationService.unreadConversationsCount({
                authID: Context.get("authID"),
            });
            res.status(200).json({
                message: "Unread conversations count",
                data: count,
            });
        } catch (error: any) {
            this.handleError(error, req, res);
        }
    };
}

export default ConversationController;