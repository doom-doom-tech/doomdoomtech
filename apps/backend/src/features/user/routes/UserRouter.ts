import {injectable} from "tsyringe";
import BaseRouter from "../../../common/routes/BaseRouter";
import {container} from "../../../common/utils/tsyringe";
import {IUserController} from "../controllers/UserController";
import {IAlbumController} from "../../album/controllers/AlbumController";
import {INoteController} from "../../note/controllers/NoteController";
import {IFollowController} from "../../follow/controllers/FollowController";
import {IListTrackController} from "../../list/controllers/ListController";
import UserBlockRouter from "./UserBlockRouter";
import Authorized from "../../auth/middleware/authorized";
import authorized from "../../auth/middleware/authorized";
import Subscribed from "../../auth/middleware/subscribed";

@injectable()
export class UserRouter extends BaseRouter {

    constructor() {
        super();
        this.initializeRoutes();
    }

    public initializeRoutes() {
        // Lazy resolve controller
        const userController = container.resolve<IUserController>("UserController");
        const albumController = container.resolve<IAlbumController>("AlbumController");
        const noteController = container.resolve<INoteController>("NoteController");
        const followController = container.resolve<IFollowController>("FollowController");
        const listController = container.resolve<IListTrackController>("ListTrackController");

        this.router.use(
            '/block',
            new UserBlockRouter().getRouter()
        )

        this.router.put(
            "/",
            userController.update
        );

        this.router.delete(
            "/",
            userController.delete
        );

        this.router.get(
            "/suggested",
            authorized,
            userController.suggested
        )

        this.router.get(
            "/search",
            userController.search
        );

        this.router.get(
            "/labels",
            userController.labels
        );

        this.router.get(
            "/latest",
            userController.latest
        );

        this.router.get(
            "/visitors",
            Authorized,
            Subscribed,
            userController.visitors
        );

        this.router.get(
            "/current",
            userController.current
        );

        this.router.get(
            "/last-active",
            userController.lastActive
        );

        this.router.get(
            "/:userID/tracks",
            userController.tracks
        );

        this.router.post(
            "/:userID/visit",
            Authorized,
            userController.visit
        );

        this.router.get(
            "/:userID/top-picks",
            listController.tracks
        );

        this.router.get(
            "/:userID/albums",
            albumController.user
        );

        this.router.get(
            "/:userID/following",
            followController.followees
        );

        this.router.get(
            "/:userID/followers",
            followController.followers
        );

        this.router.get(
            "/:userID/notes",
            noteController.user
        );

        this.router.get(
            "/:userID/latest-releases",
            userController.latestReleases
        );

        this.router.get(
            "/:userID",
            userController.find
        );
    }
}

export default UserRouter;