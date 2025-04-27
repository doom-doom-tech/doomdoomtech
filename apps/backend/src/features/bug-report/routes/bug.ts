import {Router} from "express";
import {injectable} from "tsyringe";
import {IBugReportController} from "../controllers/BugReportController";
import BaseRouter from "../../../common/routes/BaseRouter";
import {container} from "../../../common/utils/tsyringe";

@injectable()
export class BugReportRouter extends BaseRouter {
	public router: Router;

	constructor() {
		super();
		this.router = Router();
		this.initializeRoutes();
	}

	public getRouter(): Router {
		return this.router;
	}

	protected initializeRoutes(): void {
		
		// Lazy resolve controller
		const bugReportController = container.resolve<IBugReportController>("BugReportController");

		this.router.post('/report', bugReportController.report.bind(bugReportController));
	}
}