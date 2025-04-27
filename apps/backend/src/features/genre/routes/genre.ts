import {Router} from "express";
import {injectable} from "tsyringe";
import {IGenreController} from "../controllers/GenreController";
import BaseRouter from "../../../common/routes/BaseRouter";
import {container} from "../../../common/utils/tsyringe";
import SubgenreRouter from "./subgenre";

@injectable()
export class GenreRouter extends BaseRouter {

    constructor() {
        super();
        this.initializeRoutes();
    }

    public static register(): void {
        container.register("GenreRouter", { useClass: GenreRouter });
    }

    public getRouter(): Router {
        return this.router;
    }

    protected initializeRoutes(): void {
        const subgenreRouter = container.resolve<SubgenreRouter>("SubgenreRouter");
        const genreController = container.resolve<IGenreController>("GenreController")
        
        this.router.get(
            '/:genre/tracks',
            genreController.tracks
        );

        this.router.get(
            '/all',
            genreController.all
        )

        this.router.get(
            '/filled',
            genreController.filled
        );

        this.router.use(
            '/subgenre',
            subgenreRouter.getRouter()
        )
    }
}

// Export the class but don't register immediately
export default GenreRouter;