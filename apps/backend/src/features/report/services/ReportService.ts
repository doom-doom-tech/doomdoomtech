import {IServiceInterface, Service} from "../../../common/services/Service";
import {Prisma} from "@prisma/client";
import {singleton} from "tsyringe";
import {ReportEntityRequest} from "../types/requests";

export interface IReportService extends IServiceInterface {
    create(data: ReportEntityRequest): Promise<void>
}

@singleton()
class ReportService extends Service implements IReportService {
    public async create(data: ReportEntityRequest) {

        const payload: Prisma.ReportCreateArgs = {
            data: {
                content: data.content
            } as Prisma.ReportCreateArgs['data']
        }

        switch (data.entityType) {
            case "Note": payload.data.noteID = data.entityID; break;
            case "Track": payload.data.trackID = data.entityID; break;
            case "Album": payload.data.albumID = data.entityID; break;
            case "Comment": payload.data.commentID = data.entityID; break;
        }

        await this.db.report.create(payload)
    }
}

ReportService.register()