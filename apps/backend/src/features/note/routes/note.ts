import {Router} from "express";
import {injectable} from "tsyringe";
import BaseRouter from "../../../common/routes/BaseRouter";
import {container} from "../../../common/utils/tsyringe";
import {INoteController} from "../controllers/NoteController";
import Authorized from "../../auth/middleware/Authorized";
import LimitNoteCount from "../middleware/LimitNoteCount";


@injectable()
export class NoteRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.initializeRoutes();
    }

    public getRouter() {
        return this.router;
    }

    public async initializeRoutes() {
        const noteController = container.resolve<INoteController>("NoteController");

        this.router.get(
            "/",
            noteController.all
        );

        this.router.post(
            "/",
            Authorized,
            LimitNoteCount,
            noteController.create
        );

        this.router.get(
            "/search",
            noteController.search
        );

        this.router.post(
            "/:noteID/loop",
            Authorized,
            noteController.loop
        );

        this.router.get(
            "/:noteID/comments",
            noteController.comments
        );

        this.router.post(
            "/:noteID/like",
            Authorized,
            noteController.like
        );

        this.router.post(
            "/:noteID/unlike",
            Authorized,
            noteController.unlike
        );

        this.router.get(
            "/:noteID",
            noteController.single
        );

        this.router.delete(
            "/:noteID",
            Authorized,
            noteController.delete
        )
    }
}

export default NoteRouter;