import {NextFunction, Request, Response} from "express";
import {formatErrorResponse, formatMutationResponse} from "../../../common/utils/responses";
import Controller from "../../../common/controllers/Controller";
import {container, injectable} from "tsyringe";
import {RegistrationRequestInterface} from "../types/requests";
import {IAuthService} from "../services/AuthService";
import ValidationError from "../../../common/classes/errors/ValidationError";

export interface IAuthController {
	request(req: Request, res: Response, next: NextFunction): Promise<void>;
	authorize(req: Request, res: Response, next: NextFunction): Promise<void>;
	signup(req: Request<any, any, RegistrationRequestInterface>, res: Response, next: NextFunction): Promise<void>;
	sendVerificationEmail(req: Request, res: Response, next: NextFunction): Promise<void>;
	verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void>;
	requestVerificationEmail(req: Request, res: Response, next: NextFunction): Promise<void>;
}

@injectable()
class AuthController extends Controller implements IAuthController {

	public request = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const authService = container.resolve<IAuthService>("AuthService");
			await authService.request(req.body);

			res.status(200).json(formatMutationResponse('Login code sent'))
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	}

	public authorize = async (req: Request, res: Response) => {
		try {
			const authService = container.resolve<IAuthService>("AuthService");

			const { user, token} =  await authService.authorize(req.body);

			res.status(200).json({
				message: 'Login successful',
				data: { user, token }
			});
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	};

	public signup = async (req: Request<any, any, RegistrationRequestInterface>, res: Response) => {
		try {
			const authService = container.resolve<IAuthService>("AuthService");

			console.log(req.body)

			const { email, username, newsletter, label, code } = req.body;

			if (!email) throw new ValidationError("Email is required");
			if (!username) throw new ValidationError("Username is required");

			const { user, token } = await authService.signup({
				code,
				email,
				label,
				username,
				newsletter
			});

			res.status(200).json({
				message: 'Registration successful',
				data: { token, user }
			});
		} catch (error: any) {
			console.error(error)
			this.handleError(error, req, res);
		}
	};

	public sendVerificationEmail = async (req: Request, res: Response) => {
		try {
			const authService = container.resolve<IAuthService>("AuthService");

			const { email } = req.body;

			if (!email) {
				res.status(422).json(formatErrorResponse('Email is required'));
				return;
			}

			await authService.sendVerificationEmail(email);

			res.status(200).json({
				message: 'Verification email sent',
				data: {}
			});
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	};

	public verifyEmail = async (req: Request, res: Response) => {
		try {
			const authService = container.resolve<IAuthService>("AuthService");

			const { email, token } = req.body;

			if (!email || !token) {
				res.status(422).json(formatErrorResponse('Email and token are required'));
				return;
			}

			await authService.verifyEmail(email, token);

			res.status(200).json({
				message: 'Email verified successfully',
				data: {}
			});
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	};

	public requestVerificationEmail = async (req: Request, res: Response) => {
		try {
			const authService = container.resolve<IAuthService>("AuthService");

			await authService.sendVerificationEmail(req.body.email);

			res.status(200).json({
				message: 'Email verify mail sent',
				data: {}
			});
		} catch (error: any) {
			this.handleError(error, req, res);
		}
	};
}


AuthController.register()