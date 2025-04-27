import Controller from "../../../common/controllers/Controller";
import {inject, singleton} from "tsyringe";
import {Request, Response} from "express";
import {formatMutationResponse} from "../../../common/utils/responses";
import {ISubscriptionService} from "../services/SubscriptionService";

export interface ISubscriptionController {
    validatePremiumStatus(req: Request, res: Response): Promise<void>
}

@singleton()
class SubscriptionController extends Controller implements ISubscriptionController {

    constructor(
        @inject("SubscriptionService") private subscriptionService: ISubscriptionService
    ) { super() }

    public validatePremiumStatus = async (req: Request, res: Response) => {
        try {
            await this.subscriptionService.validateSubscriptionStatus()
            res.status(200).json(formatMutationResponse('Subscription validation done.'))
        } catch (error: any) {
            this.handleError(error, req, res)
        }
    }
}

SubscriptionController.register()