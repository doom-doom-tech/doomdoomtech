import {NextFunction, Request, Response} from "express";
import {container, singleton} from "tsyringe";
import Controller from "../../../common/controllers/Controller";
import {CreateCommentRequest, ICommentService} from "../services/CommentService";
import {formatErrorResponse, formatMutationResponse, formatSuccessResponse} from "../../../common/utils/responses";
import _ from "lodash";
import {Context} from "../../../common/utils/context";
import UnauthorizedError from "../../../common/classes/errors/UnauthorizedError";
import {FindCommentsRequest} from "../types/requests";
import EntityNotFoundError from "../../../common/classes/errors/EntityNotFoundError";

export interface ICommentController {
	find (req: Request<FindCommentsRequest>, res: Response): Promise<void>;
	delete(req: Request<{ commentID: number }>, res: Response, next: NextFunction): Promise<void>;
	replies(req: Request<{ commentID: number }>, res: Response): Promise<void>;
	create(req: Request<any, any, CreateCommentRequest>, res: Response, next: NextFunction): Promise<void>;
}

@singleton()
class CommentController extends Controller implements ICommentController {

	constructor() {
		super();
	}

	public find = async (req: Request<FindCommentsRequest>, res: Response) => {
		try {
			const commentService = container.resolve<ICommentService>("CommentService");

			const { entity, entityID } = req.params;

			if (!entity || !entityID) {
				res.status(422).json(formatErrorResponse("Entity and Entity ID are required"));
				return;
			}

			const comments = await commentService.find({
				entity: entity,
				entityID: Number(entityID),
				authID: Context.get('authID'),
				cursor: req.query.cursor as string,
			});

			res.status(200).json(formatSuccessResponse("Comments", comments));
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	};

	public delete = async (req: Request<{ commentID: number }>, res: Response) => {
		try {
			const commentService = container.resolve<ICommentService>("CommentService");

			const comment = await commentService.findSingle({
				authID: Context.get("authID"),
				commentID: Number(req.params.commentID)
			});

			if(!comment) throw new EntityNotFoundError("Comment")
			if (Context.get('authID') !== comment.sender.id) throw new UnauthorizedError();

			await commentService.delete({
				commentID: comment.id,
				entity: comment.entity,
				entityID: comment.entityID
			});

			res.status(200).json(formatMutationResponse("Comment deleted"));
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	};

	public replies = async (req: Request<{ commentID: number }>, res: Response) => {
		try {
			const commentService = container.resolve<ICommentService>("CommentService");

			const comments = await commentService.findReplies({
				authID: Context.get('authID'),
				commentID: Number(req.params.commentID),
				cursor: req.query.cursor as string,
			});

			res.status(200).json(formatSuccessResponse("Replies", comments));
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	};

	public create = async (req: Request<any, any, CreateCommentRequest>, res: Response) => {
		try {
			const commentService = container.resolve<ICommentService>("CommentService");

			const { content, entity, entityID } = req.body;

			if (_.isEmpty(content) || !entity || !entityID) {
				res.status(422).json(formatErrorResponse("Content, entity, and entity ID are required"));
				return;
			}

			const requestBody: CreateCommentRequest = {
				entity: req.body.entity,
				entityID: Number(req.body.entityID),
				parentID: req.body.parentID,
				content: content,
				senderID: Context.get('authID'),
				authID: Context.get('authID'),
			};

			await commentService.create(requestBody);

			res.status(201).json({
				message: "Comment created successfully",
				data: {}
			});
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	};
}

CommentController.register()

export default CommentController;