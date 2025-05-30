import {inject, injectable} from "tsyringe";
import {Request, Response} from "express";
import {formatMutationResponse, formatSuccessResponse} from "../../../common/utils/responses";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import Controller from "../../../common/controllers/Controller";
import {IUploadService} from "../services/UploadService";

export interface IUploadController {
    latest(req: Request, res: Response): Promise<void>;
    remove(req: Request, res: Response): Promise<void>;
}

@injectable()
export class UploadController extends Controller implements IUploadController {

    constructor(
        @inject("Database") protected readonly db: ExtendedPrismaClient,
        @inject("UploadService") protected readonly uploadService: IUploadService
    ) { super() }

    public latest = async (req: Request, res: Response): Promise<void> => {
        try {
            const upload = await this.uploadService.latest();
            res.status(200).json(formatSuccessResponse("Upload", upload));
        } catch (error) {
            this.handleError(error, req, res);
        }
    }

    public remove = async (req: Request, res: Response) => {
        try {
            const upload = await this.uploadService.remove(req.body.trackID);
            res.status(200).json(formatMutationResponse("Upload deleted"));
        } catch (error) {
            this.handleError(error, req, res);
        }
    }
}
