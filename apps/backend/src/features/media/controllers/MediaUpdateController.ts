import {Request, Response} from "express";
import {inject, injectable} from "tsyringe";
import {IMediaUpdateService} from "../services/MediaUpdateService";
import Controller from "../../../common/controllers/Controller";
import {formatErrorResponse, formatMutationResponse} from "../../../common/utils/responses";

export interface IMediaUpdateController {
    updateMediaSource(req: Request, res: Response): Promise<void>;
}

@injectable()
export class MediaUpdateController extends Controller implements IMediaUpdateController {

    constructor(
        @inject("MediaUpdateService") private mediaUpdateService: IMediaUpdateService
    ) { super() }

    public updateMediaSource = async (req: Request, res: Response): Promise<void> => {
        try {
            const { uuid, source, filename } = req.body;

            if (!uuid || !source) {
                res.status(400).json(formatErrorResponse("UUID and source are required."));
                return;
            }

            await this.mediaUpdateService.update({
                uuid, source, filename
            });

            res.status(200).json(formatMutationResponse("Media updated"));
        } catch (error: any) {
            this.handleError(error, req, res);
        }
    }
}

MediaUpdateController.register();