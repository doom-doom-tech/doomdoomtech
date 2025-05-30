import {inject, injectable} from "tsyringe";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {Context} from "../../../common/utils/context";
import {IServiceInterface, Service} from "../../../common/services/Service";
import {CreateTrackRequest} from "../../track/types/requests";
import {Upload} from "@prisma/client";
import EntityNotFoundError from "../../../common/classes/errors/EntityNotFoundError";
import _ from "lodash";

export interface UpdateUploadRequest {
    trackID: number
}

export interface IUploadService extends IServiceInterface {
    create(data: CreateTrackRequest & { trackID: number }): Promise<void>;
    latest(): Promise<Upload>;
    complete(data: UpdateUploadRequest): Promise<void>;
    remove(data: UpdateUploadRequest): Promise<void>;
}

@injectable()
export class UploadService extends Service implements IUploadService {

    constructor(
        @inject("Database") protected readonly db: ExtendedPrismaClient
    ) { super() }

    public create = async (data: CreateTrackRequest & { trackID: number }) => {
        await this.db.upload.create({
            data: {
                trackID: data.trackID,
                userID: Context.get('authID'),
                payload: JSON.stringify(_.omit(data, ['trackID'])),
                status: "Pending",
            }
        });
    }

    public latest = async () => {
        const latestUpload = await this.db.upload.findFirst({
            where: {
                userID: Context.get('authID')
            },
            orderBy: {
                created: "desc"
            },
            take: 1
        });

        if (!latestUpload) throw new EntityNotFoundError("Upload")

        return {
            ...latestUpload,
            payload: JSON.parse(latestUpload.payload as string)
        };
    }

    public complete = async (data: UpdateUploadRequest) => {
        await this.db.upload.update({
            where: {
                trackID: data.trackID
            },
            data: {
                status: "Completed"
            }
        })
    }

    public remove = async (data: UpdateUploadRequest) => {
        await this.db.upload.deleteMany({
            where: {
                trackID: data.trackID
            },
        })
    }
}