import {Request, Response} from "express";
import {IAppleAuthService} from "../services/social-login/AppleAuthService";
import {IGoogleAuthService} from "../services/social-login/GoogleAuthService";
import Controller from "../../../common/controllers/Controller";
import {container, singleton} from "tsyringe";
import {OAuthUserInfo} from "../types";

export interface ISocialLoginController {
	apple(req: Request<any, any, OAuthUserInfo>, res: Response): Promise<void>;
	google(req: Request<any, any, { token: string }>, res: Response): Promise<void>;
}

@singleton()
class SocialLoginController extends Controller implements ISocialLoginController {

	constructor() {
		super();
	}

	public apple = async (req: Request<any, any, OAuthUserInfo>, res: Response) => {
		try {
			const appleAuthService = container.resolve<IAppleAuthService>("AppleAuthService");
			const result = await appleAuthService.login(req.body);
			res.status(200).json(result);
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	}

	public google = async (req: Request<any, any, { token: string }>, res: Response) => {
		try {
			const googleAuthService = container.resolve<IGoogleAuthService>("GoogleAuthService");

			const result = await googleAuthService.login(req.body.token);
			res.status(200).json(result);
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	}
}

SocialLoginController.register();