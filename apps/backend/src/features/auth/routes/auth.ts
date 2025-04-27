import {injectable} from "tsyringe";
import BaseRouter from "../../../common/routes/BaseRouter";
import createDynamicRateLimiter from "../../../common/middleware/limiter";
import {formatErrorResponse} from "../../../common/utils/responses";
import {container} from "../../../common/utils/tsyringe";
import {IAuthController} from "../controllers/AuthController";
import SocialLoginRouter from "./social-login";

@injectable()
export class AuthRouter extends BaseRouter {

	constructor() {
		super();
		this.initializeRoutes();
	}

	public static register(): void {
		container.register("AuthRouter", { useClass: AuthRouter });
	}

	protected initializeRoutes(): void {
		// Rate Limiter for Password Reset and Email Verification
		const routerLevelRateLimiter = createDynamicRateLimiter({
			windowMs: 15 * 60 * 1000,
			limit: 2,
			handler: (_req, res) => {
				res.status(429).json(formatErrorResponse('You can only reset your password once every 15 minutes'));
			}
		});

		const verifyEmailLimiter = createDynamicRateLimiter({
			windowMs: 15 * 60 * 1000,
			limit: 1,
			handler: (_req, res) => {
				res.status(429).json(formatErrorResponse('You can only request a new email once every 15 minutes'));
			}
		}) as any;

		const registrationLimiter = createDynamicRateLimiter({
			windowMs: 60 * 60 * 1000,
			limit: 1,
			handler: (_req: any, res: any) => {
				res.status(429).json(formatErrorResponse('You can only register once per hour'));
			}
		}) as any;

		// Lazy Resolve AuthController
		const authController = container.resolve<IAuthController>("AuthController");

		this.router.post('/request', authController.request);
		this.router.post('/authorize', authController.authorize);
		this.router.post('/signup', registrationLimiter, authController.signup);
		this.router.post('/verify-email', authController.verifyEmail);
		this.router.post('/verify-email/request', verifyEmailLimiter, authController.requestVerificationEmail);

		// Lazy Resolve and Use Social Login Routes
		const socialLoginRouter = container.resolve<SocialLoginRouter>("SocialLoginRouter");
		this.router.use('/social', socialLoginRouter.getRouter());
	}
}