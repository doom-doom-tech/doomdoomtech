import {Request, Response} from "express";
import {inject, injectable} from "tsyringe";
import {container} from "../../../common/utils/tsyringe";
import {formatErrorResponse, formatMutationResponse} from "../../../common/utils/responses";
import {IUserUpdateService} from "../services/UserUpdateService";
import Controller from "../../../common/controllers/Controller";

export interface IUserUpdateController {
    updateAvatarUrl(req: Request, res: Response): Promise<void>;
    updateBannerUrl(req: Request, res: Response): Promise<void>;
}

@injectable()
export class UserUpdateController extends Controller implements IUserUpdateController {

    constructor(
        @inject("UserUpdateService") private userUpdateService: IUserUpdateService
    ) { super() }

    public static register(): void {
        container.register("UserUpdateController", { useClass: UserUpdateController });
    }

    public updateAvatarUrl = async (req: Request, res: Response): Promise<void> => {
        try {
            const { uuid, source } = req.body;

            if (!uuid || !source) {
                res.status(400).json(formatErrorResponse("User ID and source URL are required"));
                return;
            }

            await this.userUpdateService.updateAvatarUrl({
                uuid, source
            });

            res.status(200).json(formatMutationResponse("User avatar updated"));
        } catch (error: any) {
            this.handleError(error, req, res);
        }
    }

    public updateBannerUrl = async (req: Request, res: Response): Promise<void> => {
        try {
            const { uuid, source } = req.body;

            if (!uuid || !source) {
                res.status(400).json(formatErrorResponse("User ID and source URL are required"));
                return;
            }

            await this.userUpdateService.updateBannerUrl({
                uuid, source
            });

            res.status(200).json(formatMutationResponse("User banner updated"));
        } catch (error: any) {
            this.handleError(error, req, res);
        }
    }
}

UserUpdateController.register();