import {Router} from "express";
import {inject, injectable} from "tsyringe";
import {ISubgenreController} from "../controllers/SubgenreController";
import BaseRouter from "../../../common/routes/BaseRouter";
import {container} from "../../../common/utils/tsyringe";
import {ISubgenreService} from "../services/SubgenreService";

@injectable()
export class SubgenreRouter extends BaseRouter {
    public router: Router;

    constructor(
        @inject("SubgenreController") private subgenreController: ISubgenreController
    ) {
        super();
        this.router = Router();
        this.initializeRoutes();
    }

    public static register(): void {
        container.register("SubgenreRouter", { useClass: SubgenreRouter });
    }

    public getRouter(): Router {
        return this.router;
    }

    protected initializeRoutes(): void {

        const subgenreController = container.resolve<ISubgenreService>("SubgenreController")

        this.router.get(
            '/search',
            subgenreController.search
        )

        this.router.get(
            '/:subgenre/tracks',
            subgenreController.tracks
        );

        this.router.get(
            '/filled',
            subgenreController.filled
        );
    }
}

// Export the class but don't register immediately
export default SubgenreRouter;