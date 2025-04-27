import Controller from "../../../common/controllers/Controller";
import {Request, Response} from "express";
import {ReportEntityRequest} from "../types/requests";
import {IReportService} from "../services/ReportService";
import {container} from "tsyringe";
import {formatMutationResponse} from "../../../common/utils/responses";

export interface IReportController {
    create(req: Request<any, any, ReportEntityRequest>, res: Response): Promise<void>
}

class ReportController extends Controller implements IReportController {
    public create = async (req: Request<any, any, ReportEntityRequest>, res: Response)=>  {
        try {
            const reportService = container.resolve<IReportService>("ReportService");
            await reportService.create(req.body)

            res.status(200).json(formatMutationResponse("Report received"))
        } catch (error: any) {
            this.handleError(error, res, res)
        }
    }
}

ReportController.register()