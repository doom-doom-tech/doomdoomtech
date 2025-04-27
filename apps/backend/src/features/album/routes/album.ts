import {Router} from "express";
import {injectable} from "tsyringe";
import BaseRouter from "../../../common/routes/BaseRouter";
import {container} from "../../../common/utils/tsyringe";
import {IAlbumController} from "../controllers/AlbumController";

@injectable()
export class AlbumRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.initializeRoutes();
    }

    public static register(): void {
        container.register("AlbumRouter", { useClass: AlbumRouter });
    }

    public getRouter(): Router {
        return this.router;
    }

    protected initializeRoutes(): void {
        const albumController = container.resolve<IAlbumController>("AlbumController");

        this.router.post('/', albumController.create)
    }
}

export default AlbumRouter;