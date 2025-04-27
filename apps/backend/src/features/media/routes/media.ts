import {Router} from "express";
import {injectable} from "tsyringe";
import BaseRouter from "../../../common/routes/BaseRouter";
import {container} from "../../../common/utils/tsyringe";
import {IMediaProxyController} from "../../proxy/controllers/ProxyController";
import {IMediaController} from "../controllers/MediaController";
import Authorized from "../../auth/middleware/authorized";
import multer from "multer";
import path from "path";

const upload = multer({ dest: 'uploads/' })

@injectable()
export class MediaRouter extends BaseRouter {
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
		const proxyController = container.resolve<IMediaProxyController>("ProxyController");
		const mediaController = container.resolve<IMediaController>("MediaController");

		this.router.put(
			'/upload',
			Authorized,
			//@ts-ignore
			(upload as any).single('file'),
			//@ts-ignore
			mediaController.upload
		);

		this.router.get(
			'/:type/:hash',
			proxyController.handleProxyRequest
		);
	}
}
