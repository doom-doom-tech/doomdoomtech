import Controller from "../../../common/controllers/Controller";
import {Request, Response} from "express";
import {inject, singleton} from "tsyringe";
import {FetchRankedListRequest} from "../../../common/services/RankedListService";
import {Context} from "../../../common/utils/context";
import {formatSuccessResponse} from "../../../common/utils/responses";
import {ILabelService} from "../services/LabelService";

export interface ILabelController {
    latest(req: Request<any, any, any, FetchRankedListRequest>, res: Response<any>): Promise<void>
}

@singleton()
class LabelController extends Controller implements ILabelController {
    constructor(
        @inject("LabelService") private labelService: ILabelService,
    ) { super() }

    public latest = async (req: Request<any, any, any, FetchRankedListRequest>, res: Response<any>) => {
        try {
            const requestObject = {
                cursor: req.query.cursor,
                period: req.query.period,
                authID: Context.get('authID'),
                genreID: Number(req.query.genreID),
                subgenreID: Number(req.query.subgenreID),
            }

            res.status(200).json(formatSuccessResponse('Labels', await this.labelService.latest(requestObject)))
        } catch (error: any) {
            this.handleError(error, req, res)
        }
    }
}

LabelController.register()