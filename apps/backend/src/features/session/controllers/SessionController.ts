import {Request, Response} from 'express';
import {ISessionService} from "../services/SessionService";
import {formatErrorResponse} from "../../../common/utils/responses";
import {Context} from "../../../common/utils/context";
import Controller from "../../../common/controllers/Controller";
import {container} from "../../../common/utils/tsyringe";

export interface ISessionController {
    create(req: Request, res: Response): Promise<void>
}

class SessionController extends Controller implements ISessionController {

    public create = async (req: Request, res: Response)=>  {
        try {
            const sessionService = container.resolve<ISessionService>("SessionService")

            const deviceID = req.header('x-device-id');

            if (!deviceID) {
                res.status(400).json(formatErrorResponse('Device ID missing')); return
            }

            const session = await sessionService.create(Context.get('authID'), deviceID);

            res.setHeader('x-session-id', session.id);

            res.status(201).json({
                message: 'Session created successfully'
            });
        } catch (error) {
            this.handleError(error, req, res)
        }
    }
}

SessionController.register()