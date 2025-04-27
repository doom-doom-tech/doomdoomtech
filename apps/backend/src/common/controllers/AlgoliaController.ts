import Controller from "./Controller";
import {Request, Response} from "express";
import {container} from "tsyringe";
import {IAlgoliaService} from "../services/AlgoliaService";
import {Context} from "../utils/context";
import {formatMutationResponse} from "../utils/responses";

export interface IAlgoliaController {
    personalize(req: Request, res: Response): Promise<void>;
    pushEvent(req: Request, res: Response): Promise<void>;
}

class AlgoliaController extends Controller implements IAlgoliaController {

    public personalize = async (req: Request, res: Response) => {
        try {
            const algoliaService = container.resolve<IAlgoliaService>("AlgoliaService")

            await algoliaService.personalize({
                authID: Context.get('authID'),
                genres: req.body.genres,
            })

            res.status(200).json(formatMutationResponse('Personalization complete'))
        } catch (error: any) {
            this.handleError(error, req, res)
        }
    }

    public pushEvent = async (req: Request, res: Response) => {
        try {
            const algoliaService = container.resolve<IAlgoliaService>("AlgoliaService")

            await algoliaService.pushEvent({
                entityID: req.body.entityID,
                eventName: req.body.eventName,
                eventType: req.body.eventType,
                authID: Context.get('authID'),
                entityType: req.body.entityType,
            })

            res.status(200).json(formatMutationResponse('Event sent'))
        } catch (error: any) {
            this.handleError(error, req, res)
        }
    }
}

export default AlgoliaController