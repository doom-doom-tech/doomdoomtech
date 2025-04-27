import Controller from "../../../common/controllers/Controller";
import {FindUserAlbumsRequest, IAlbumService} from "../services/AlbumService";
import {container} from "../../../common/utils/tsyringe";
import {Request, Response} from "express"
import {formatMutationResponse, formatSuccessResponse} from "../../../common/utils/responses";
import {Context} from "../../../common/utils/context";
import {singleton} from "tsyringe";
import {CreateAlbumRequest} from "../types/requests";

export interface IAlbumController {
    user(req: Request<any, any, any, FindUserAlbumsRequest>, res: Response): Promise<void>
    create(req: Request<any, any, CreateAlbumRequest>, res: Response): Promise<void>
}

@singleton()
class AlbumController extends Controller implements IAlbumController {
    constructor() {
        super();
    }

    public user = async (req: Request<{ userID: string | number }, any, any, FindUserAlbumsRequest>, res: Response) => {
        try {
            const albumService = container.resolve<IAlbumService>("AlbumService")

            const albums = await albumService.user({
                authID: Context.get('authID'),
                cursor: req.query.cursor,
                userID: Number(req.params.userID)
            })

            res.status(200).json(formatSuccessResponse('Albums', albums))
        } catch (error: any) {
            console.log(error)
            this.handleError(error, res, res)
        }
    }

    public create = async (req: Request<any, any, CreateAlbumRequest>, res: Response) => {
        try {
            await container
                .resolve<IAlbumService>("AlbumService")
                .create({
                    ...req.body,
                    authID: Context.get('authID'),
                })

            res.status(200).json(formatMutationResponse('Album created'))
        } catch (error: any) {
            this.handleError(error, res, res)
        }
    }
}

AlbumController.register()