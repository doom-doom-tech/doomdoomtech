import Controller from "../../../common/controllers/Controller";
import {Request, Response} from "express";
import {singleton} from "tsyringe";
import {INoteService} from "../services/NoteService";
import {container} from "../../../common/utils/tsyringe";
import {CreateNoteRequest, FetchNotesRequest, FindUserNotesRequest, NoteIDRequest} from "../types/requests";
import {Context} from "../../../common/utils/context";
import {formatMutationResponse, formatSuccessResponse} from "../../../common/utils/responses";
import {ICommentService} from "../../comment/services/CommentService";
import {EncodedCursorInterface} from "../../../common/types/pagination";
import {AuthenticatedRequest} from "../../auth/types/requests";
import {FormData, SearchQueryInterface} from "../../../common/types";
import _ from "lodash";
import ValidationError from "../../../common/classes/errors/ValidationError";

export interface INoteController {
    all(req: Request<any, any, any, FetchNotesRequest>, res: Response): Promise<void>
    search(req: Request<any, any, any, Required<SearchQueryInterface>>, res: Response): Promise<void>
    single(req: Request<{ noteID: number }>, res: Response): Promise<void>;
    like(req: Request<{ noteID: number }>, res: Response): Promise<void>;
    unlike(req: Request<{ noteID: number }>, res: Response): Promise<void>;
    create(req: Request<any, any, FormData<CreateNoteRequest>>, res: Response): Promise<void>;
    loop(req: Request<NoteIDRequest, any, AuthenticatedRequest>, res: Response): Promise<void>;
    user(req: Request<{ userID: number }, any, any, FindUserNotesRequest>, res: Response): Promise<void>;
    comments(req: Request<{ noteID: number }, any, any, EncodedCursorInterface>, res: Response): Promise<void>;
    delete(req: Request<{ noteID: number }>, res: Response):  Promise<void>;
}

@singleton()
class NoteController extends Controller implements INoteController {

    constructor() {
        super()
    }

    public all = async (req: Request<any, any, any, FetchNotesRequest>, res: Response): Promise<void> => {
        try {
            const noteService = container.resolve<INoteService>("NoteService")

            const notes = await noteService.all({
                cursor: req.query.cursor,
                period: req.query.period,
                userID: req.query.userID,
                genreID: req.query.genreID,
                labelTag: req.query.labelTag,
                authID: Context.get("authID"),
                subgenreID: req.query.subgenreID,
            })

            res.status(200).json(formatSuccessResponse('Notes', notes))
        } catch (error: any) {
            this.handleError(error, req, res)
        }
    }

    public search = async (req: Request<any, any, any, Required<SearchQueryInterface>>, res: Response): Promise<void> => {
        try {
            const noteService = container.resolve<INoteService>("NoteService")

            const response = await noteService.search({
                query: req.query.query,
                cursor: req.body.cursor,
                authID: Context.get("authID"),
            });

            res.status(200).json(formatSuccessResponse("Notes", response));
        } catch (error: any) {
            this.handleError(error, req, res);
        }
    }

    public create = async (req: Request<any, any,  FormData<CreateNoteRequest>>, res: Response): Promise<void> => {
        try {
            const noteService = container.resolve<INoteService>("NoteService")

            let requestObject = {
                uuid: req.body.uuid,
                content: req.body.content,
                authID: Context.get('authID'),
                attachments: req.body.attachments ? JSON.parse(req.body.attachments) : []
            }

            if(req.body.trackID) {
                _.set(requestObject, 'trackID', parseInt(req.body.trackID))
            }

            const note = await noteService.create(requestObject)

            res.status(200).json(formatMutationResponse('Note created', note))
        } catch (error: any) {
            this.handleError(error, req, res)
        }
    }

    public loop = async (req: Request<NoteIDRequest, any, AuthenticatedRequest>, res: Response) => {
        try {
            const noteService = container.resolve<INoteService>("NoteService")
            
            const note = await noteService.loop({ noteID: Number(req.params.noteID), authID: Context.get('authID') })
            res.status(200).json(formatMutationResponse('Note looped', note))
        } catch(error: any) {
            this.handleError(error, req, res)
        }
    }

    public comments = async (req: Request<{ noteID: number }, any, any, EncodedCursorInterface>, res: Response) => {
        try {
            const commentService = container.resolve<ICommentService>("CommentService")

            const comments = await commentService.find({
                entity: "Note",
                entityID: Number(req.params.noteID),
                cursor: req.query.cursor,
                authID: Context.get("authID"),
            })

            res.status(200).json(formatSuccessResponse('Comments', comments))

        } catch (error: any) {
            this.handleError(error, req, res)
        }
    }

    public like = async (req: Request<{ noteID: number }>, res: Response): Promise<void> => {
        try {
            const noteService = container.resolve<INoteService>("NoteService")

            await noteService.like({
                noteID: Number(req.params.noteID),
                authID: Context.get("authID"),
            })

            res.status(200).json(formatMutationResponse('Note liked'))
        } catch (error: any) {
            this.handleError(error, req, res)
        }
    }

    public unlike = async (req: Request<{ noteID: number }>, res: Response): Promise<void> => {
        try {
            const noteService = container.resolve<INoteService>("NoteService")

            await noteService.unlike({
                noteID: Number(req.params.noteID),
                authID: Context.get("authID"),
            })

            res.status(200).json(formatMutationResponse('Note like removed'))
        } catch (error: any) {
            this.handleError(error, req, res)
        }
    }

    public single = async (req: Request<{ noteID: number }>, res: Response) => {
        try {
            const noteService = container.resolve<INoteService>("NoteService")

            const note = await noteService.find({
                noteID: Number(req.params.noteID),
                authID: Context.get("authID"),
            })

            res.status(200).json(formatSuccessResponse('Note', note))
        } catch (error: any) {
            this.handleError(error, req, res)
        }
    }

    public user = async (req: Request<{ userID: number }, any, any, FindUserNotesRequest>, res: Response) => {
        try {
            const noteService = container.resolve<INoteService>("NoteService")

            const notes = await noteService.user({
                userID: Number(req.params.userID),
                cursor: req.query.cursor,
                authID: Context.get("authID"),
            })

            res.status(200).json(formatSuccessResponse('Notes', notes))
        } catch (error: any) {
            this.handleError(error, res, res)
        }
    }

    public delete = async (req: Request<{ noteID: number }>, res: Response) => {
        try {
            const noteService = container.resolve<INoteService>("NoteService")

            const note = await noteService.find({
                noteID: Number(req.params.noteID), authID: Context.get("authID"),
            })

            if(note.user.id !== Context.get("authID")) throw new ValidationError("You can only delete your own notes")

            await noteService.delete({
                noteID: Number(req.params.noteID)
            })

            res.status(200).json(formatMutationResponse('Note deleted'))
        } catch (error: any) {
            this.handleError(error, req, res)
        }
    }
}

NoteController.register()