import Controller from "../../../common/controllers/Controller";
import {singleton} from "tsyringe";
import {Request, Response} from "express";
import {TrackIDRequest, TrackPlaytimeBatchRequest} from "../types/requests";
import {container} from "../../../common/utils/tsyringe";
import {formatErrorResponse, formatMutationResponse} from "../../../common/utils/responses";
import {DeviceIDRequest} from "../../device/types";
import {ITrackActionService} from "../services/TrackActionService";


export interface ITrackActionController {
    processViewRequest(req: Request<TrackIDRequest>, res: Response): Promise<void>
    processPlayRequest(req: Request<TrackIDRequest>, res: Response): Promise<void>
    processStreamRequest(req: Request<TrackIDRequest, any, DeviceIDRequest>, res: Response): Promise<void>
    processPlaytimeBatch(req: Request<TrackIDRequest, any, any, TrackPlaytimeBatchRequest>, res: Response): Promise<void>
}

@singleton()
class TrackActionController extends Controller implements ITrackActionController {

    public processViewRequest = async (
        req: Request<TrackIDRequest>,
        res: Response
    ): Promise<void> => {
        try {
            const trackActionService = container.resolve<ITrackActionService>("TrackActionService")
            await trackActionService.processViewRequest({ trackID: Number(req.params.trackID) })

            res.status(200).json(formatMutationResponse('View added'))
        } catch (error: any) {
            console.log(error)
            this.handleError(error, req, res);
        }
    }

    public processStreamRequest = async (
        req: Request<TrackIDRequest, any, DeviceIDRequest>,
        res: Response
    ): Promise<void> => {
        try {
            const trackActionService = container.resolve<ITrackActionService>("TrackActionService")
            await trackActionService.processStreamRequest({ trackID: Number(req.params.trackID) })

            console.log('stream added')
            res.status(200).json(formatMutationResponse('Stream added'))
        } catch (error: any) {
            console.log(error)
            this.handleError(error, req, res);
        }
    }

    public processPlayRequest = async (
        req: Request<TrackIDRequest>,
        res: Response
    ) => {
        try {
            const trackActionService = container.resolve<ITrackActionService>("TrackActionService")

            await trackActionService.processPlayRequest({
                trackID: Number(req.params.trackID)
            })

            res.status(200).json(formatMutationResponse("Play added"))
        } catch (error: any) {
            this.handleError(error, req, res)
        }
    }

    public processPlaytimeBatch = async (
        req: Request<TrackIDRequest, any, any, TrackPlaytimeBatchRequest>,
        res: Response
    ) => {
        try {
            const trackActionService = container.resolve<ITrackActionService>("TrackActionService")

            if(!req.body.amount) {
                res.status(422).json(formatErrorResponse('No amount provided'));
                return;
            }

            await trackActionService.processPlaytimeBatch({
                trackID: Number(req.params.trackID),
                amount: Number(req.body.amount)
            })

            res.status(200).json(formatMutationResponse("Playtime added"))
        } catch (error: any) {
            this.handleError(error, req, res)
        }
    }
}

TrackActionController.register()