import {Router} from "express";
import {injectable} from "tsyringe";
import Authorized from "../../auth/middleware/Authorized";
import {IBlockController} from "../controllers/BlockUserController";
import BaseRouter from "../../../common/routes/BaseRouter";
import {container} from "../../../common/utils/tsyringe";

@injectable()
export class UserBlockRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.initializeRoutes();
    }

    public static register(): void {
        container.register("UserBlockRouter", { useClass: UserBlockRouter });
    }

    public getRouter(): Router {
        return this.router;
    }

    protected initializeRoutes(): void {
        const userBlockController = container.resolve<IBlockController>("BlockController")

        this.router.get('/', Authorized, userBlockController.getBlockedUsers)
        this.router.post('/', Authorized, userBlockController.blockUser)
        this.router.delete('/', Authorized, userBlockController.unblockUser)
    }
}

export default UserBlockRouter;