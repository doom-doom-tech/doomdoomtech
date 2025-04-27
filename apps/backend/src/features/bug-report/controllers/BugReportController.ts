import {Request, Response} from "express";
import BugReportService from "../services/BugReportService";
import {inject, singleton} from "tsyringe";
import Controller from "../../../common/controllers/Controller";
import {BugReportRequest} from "../types/requests";

export interface IBugReportController {
	report(req: Request<any, any, BugReportRequest>, res: Response): Promise<void>
}

@singleton()
class BugReportController extends Controller implements IBugReportController {

	constructor(
		@inject("BugReportService") private bugReportService: BugReportService,
	) { super() }

	public report = async (req: Request<any, any, BugReportRequest>, res: Response) => {
		try {
			await this.bugReportService.report({
				value: req.body.value
			})

			res.status(200).json({
				data: {},
				message: "Bug report received"
			})
		} catch (error: any) {
			this.handleError(error, req, res)
		}
	}
}

export default BugReportController