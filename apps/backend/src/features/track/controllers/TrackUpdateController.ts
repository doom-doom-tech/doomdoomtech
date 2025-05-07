import {Request, Response} from "express";
import {inject, injectable} from "tsyringe";
import {container} from "../../../common/utils/tsyringe";
import {formatErrorResponse, formatMutationResponse} from "../../../common/utils/responses";
import {ITrackUpdateService} from "../services/TrackUpdateService";
import Controller from "../../../common/controllers/Controller";

export interface ITrackUpdateController {
    updateVideoSource(req: Request, res: Response): Promise<void>;
    updateCoverSource(req: Request, res: Response): Promise<void>;
}

@injectable()
export class TrackUpdateController extends Controller implements ITrackUpdateController {

    constructor(
        @inject("TrackUpdateService") private trackUpdateService: ITrackUpdateService
    ) { super() }

    public static register(): void {
        container.register("TrackUpdateController", { useClass: TrackUpdateController });
    }

    public updateVideoSource = async (req: Request, res: Response): Promise<void> => {
        try {
            const { uuid, source } = req.body;

            if (!uuid || !source) {
                res.status(400).json(formatErrorResponse("Track ID and source URL are required"));
                return;
            }

            await this.trackUpdateService.updateVideoSource({
                uuid, source
            });

            res.status(200).json(formatMutationResponse("Track updated"));
        } catch (error: any) {
            this.handleError(error, req, res);
        }
    }

    public updateCoverSource = async (req: Request, res: Response): Promise<void> => {
        try {
            const { uuid, source } = req.body;

            if (!uuid || !source) {
                res.status(400).json(formatErrorResponse("Track ID and source URL are required"));
                return;
            }

            await this.trackUpdateService.updateCoverSource({
                uuid, source
            });

            res.status(200).json(formatMutationResponse("Track updated"));
        } catch (error: any) {
            this.handleError(error, req, res);
        }
    }
}

TrackUpdateController.register();