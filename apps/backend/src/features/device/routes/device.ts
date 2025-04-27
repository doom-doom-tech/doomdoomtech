import {Router} from "express";
import {injectable} from "tsyringe";
import BaseRouter from "../../../common/routes/BaseRouter";
import {container} from "../../../common/utils/tsyringe";
import {IDeviceController} from "../controllers/DeviceController";

@injectable()
export class DeviceRouter extends BaseRouter {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.initializeRoutes();
    }

    public static register(): void {
        container.register("DeviceRouter", { useClass: DeviceRouter });
    }

    public getRouter(): Router {
        return this.router;
    }

    protected initializeRoutes(): void {
        const deviceController = container.resolve<IDeviceController>("DeviceController");

        this.router.post(
            '/register',
            deviceController.register
        );
    }
}

export default DeviceRouter;