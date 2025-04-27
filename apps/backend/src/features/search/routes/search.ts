import {Router} from "express";
import {inject, injectable} from "tsyringe";
import {ISearchController} from "../controllers/SearchController";
import BaseRouter from "../../../common/routes/BaseRouter";
import {container} from "../../../common/utils/tsyringe";

@injectable()
export class SearchRouter extends BaseRouter {
    public router: Router;

    constructor(
        @inject("SearchController") private searchController: ISearchController
    ) {
        super();
        this.router = Router();
        this.initializeRoutes();
    }

    public static register(): void {
        container.register("SearchRouter", { useClass: SearchRouter });
    }

    public getRouter(): Router {
        return this.router;
    }

    protected initializeRoutes(): void {
        
        
        this.router.get('/tracks', this.searchController.tracks.bind(this.searchController));
        this.router.get('/users', this.searchController.users.bind(this.searchController));
    }
}