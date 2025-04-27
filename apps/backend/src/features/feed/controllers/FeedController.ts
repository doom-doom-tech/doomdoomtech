import Controller from "../../../common/controllers/Controller";
import {Request, Response} from "express";
import {singleton} from "tsyringe";
import {IFeedService} from "../services/FeedService";
import {container} from "../../../common/utils/tsyringe";
import {Context} from "../../../common/utils/context";
import {EncodedCursorInterface} from "../../../common/types/pagination";
import {formatSuccessResponse} from "../../../common/utils/responses";

export interface IFeedController {
    personalized(req: Request<any, any, any, EncodedCursorInterface>, res: Response): Promise<void>;
    recommended(req: Request, res: Response): Promise<void>;
    following(req: Request<any, any, any, EncodedCursorInterface>, res: Response): Promise<void>;
}

@singleton()
class FeedController extends Controller implements IFeedController {

    constructor() {
        super();
    }

    public personalized = async (req: Request<any, any, any, EncodedCursorInterface>, res: Response) => {
        try {
            const feedService = container.resolve<IFeedService>("FeedService");

            const response = await feedService.personalized({
                excluded: [],
                authID: Context.get('authID'),
                page: Number(req.query.cursor ?? 0),
            })

            res.status(200).json(formatSuccessResponse('items', response))
        } catch (error: any) {
            this.handleError(error, req, res)
        }
    }

    public recommended = async (req: Request, res: Response) => {
        try {
            const feedService = container.resolve<IFeedService>("FeedService");

            const response = await feedService.recommended({
                authID: Context.get('authID'),
            })

            res.status(200).json(formatSuccessResponse('items', response))
        } catch (error: any) {
            this.handleError(error, req, res)
        }
    }

    public following = async (req: Request<any, any, any, EncodedCursorInterface>, res: Response) => {
        try {
            const feedService = container.resolve<IFeedService>("FeedService");

            const response = await feedService.following({
                excluded: req.body.excluded || [],
                authID: Context.get('authID'),
                cursor: req.query.cursor
            })

            res.status(200).json(formatSuccessResponse('items', response))
        } catch (error: any) {
            this.handleError(error, req, res)
        }
    }
}

FeedController.register()