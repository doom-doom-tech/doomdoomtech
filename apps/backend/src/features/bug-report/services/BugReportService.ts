import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import Singleton from "../../../common/classes/injectables/Singleton";
import {inject, singleton} from "tsyringe";
import {BugReportRequest} from "../types/requests";

export interface IBugReportService {
	report(data: BugReportRequest): Promise<void>
	findMany(): Promise<Array<{ id: number, value: string }>>
}

@singleton()
class BugReportService extends Singleton implements IBugReportService {

	constructor(
		@inject("Database") private db: ExtendedPrismaClient,
	) { super() }

	public async report (data: BugReportRequest) {
		await this.db.bugReport.create({
			data
		})
	}

	public findMany() {
		return this.db.bugReport.findMany()
	}
}

export default BugReportService