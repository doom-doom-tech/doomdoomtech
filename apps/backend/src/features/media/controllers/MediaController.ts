import Controller from "../../../common/controllers/Controller";
import {singleton} from "tsyringe";
import {IMediaService} from "../services/MediaService";
import {container} from "../../../common/utils/tsyringe";
import {Request, Response} from "express";
import {formatSuccessResponse} from "../../../common/utils/responses";
import {WithFile} from "../../../common/types";

export interface IMediaController {
    upload(req: Request<any, any, any, UploadRequestParams> & WithFile, res: Response): Promise<void>
}

export interface UploadRequestParams {
    uuid: string
    purpose: "track.audio" | "track.video" | "track.cover" | "user.avatar" | "user.banner" | "note.attachment"
}

@singleton()
class MediaController extends Controller implements IMediaController {
    public upload = async (req: Request<any, any, any, UploadRequestParams> & WithFile, res: Response) => {
        try {
            const mediaService = container.resolve<IMediaService>('MediaService')

            const url = await mediaService.upload({
                file: req.file,
                uuid: req.query.uuid,
                purpose: req.query.purpose,
            })

            res.status(200).json(formatSuccessResponse('Upload', { url }))
        } catch (error: any) {
            console.log(error)
            this.handleError(error, req, res)
        }
    }
}

MediaController.register()