import {ExtendedPrismaClient} from "../../../../common/utils/prisma";
import {IAuthService} from "../AuthService";
import jwt from "jsonwebtoken";
import Service, {IServiceInterface} from "../../../../common/services/Service";
import {inject, singleton} from "tsyringe";
import {OAuthUserInfo} from "../../types";
import {SingleUserInterface} from "../../../user/types";
import {SingleUserMapper} from "../../../user/mappers/SingleUserMapper";
import {container} from "../../../../common/utils/tsyringe";

export interface IAppleAuthService extends IServiceInterface {
	login(payload: OAuthUserInfo): Promise<{ user: SingleUserInterface; token: string }>;
}

@singleton()
class AppleAuthService extends Service implements IAppleAuthService {
	constructor(@inject("Database") protected db: ExtendedPrismaClient) {
		super();
	}

	public async login(payload: OAuthUserInfo) {
		try {
			const email = payload.email?.toLowerCase();
			let user;

			// Step 1: If no email is provided, try to found the appleUser by token
			if (!email && payload.token) {
				const appleUser = await this.db.appleUser.findFirst({
					where: { token: payload.token },
				});

				if (!appleUser) {
					throw new Error("No Apple account found for the provided token");
				}

				// Step 2: Find the user by the email from the appleUser record
				user = SingleUserMapper.format(await this.db.user.findUnique({
					where: { email: appleUser.email },
					select: SingleUserMapper.getSelectableFields(),
				}));

				if (!user) {
					throw new Error("User not found for the linked Apple account");
				}

				// Step 3: Update the token in appleUser if necessary
				await this.db.appleUser.update({
					where: { token_email: { token: payload.token, email: appleUser.email } },
					data: { token: payload.token },
				});
			} else {
				// Step 4: Original logic for when email is provided
				user = SingleUserMapper.format(await this.db.user.findUnique({
					where: { email },
					select: SingleUserMapper.getSelectableFields(),
				}));

				if (user) {
					// Ensure an Apple account is linked
					await this.db.appleUser.upsert({
						where: { token_email: { token: payload.token!, email } },
						update: { token: payload.token! },
						create: { email, token: payload.token! },
					});
				} else {
					// Register a new user
					user = await this.registerNewUser(payload);
				}
			}

			const formattedUser = SingleUserMapper.format(user);
			const jwtToken = this.generateJWT(formattedUser.id);

			return { user: formattedUser, token: jwtToken };
		} catch (error) {
			console.error("Apple login error:", error);
			throw new Error("Failed to process Apple login");
		}
	}

	private async registerNewUser(payload: OAuthUserInfo) {
		const authService = container.resolve<IAuthService>("AuthService");

		const username = await this.createUniqueUsername(payload.firstName, payload.lastName);

		// Create Apple user record
		await this.db.appleUser.create({
			data: { token: payload.token!, email: payload.email },
		});

		// Register new user
		const registerResponse = await authService.signup({
			code: null,
			username,
			label: false,
			newsletter: false,
			email: payload.email,
		});

		return registerResponse.user;
	}

	private async createUniqueUsername(firstName?: string, lastName?: string): Promise<string> {
		const baseUsername = this.sanitizeUsername(firstName, lastName);
		return this.ensureUniqueUsername(baseUsername);
	}

	private async ensureUniqueUsername(baseUsername: string): Promise<string> {
		let username = baseUsername;
		let attempts = 0;

		while (true) {
			const exists = await this.db.user.findUnique({ where: { username } });
			if (!exists) return username;

			username = `${baseUsername}_${this.generateRandomString(4)}`;
			attempts++;

			if (attempts >= 10) {
				return `user_${this.generateRandomString(12)}`;
			}
		}
	}

	private sanitizeUsername(firstName?: string, lastName?: string): string {
		let baseUsername = `${firstName || ""}${lastName || ""}`.toLowerCase();
		return baseUsername.replace(/\s+/g, "").replace(/[^a-z0-9_]/g, "") || `user_${this.generateRandomString(8)}`;
	}

	private generateJWT(userId: number | string): string {
		return jwt.sign({ userId: String(userId) }, process.env.TOKEN_SECRET as string);
	}

	private generateRandomString(length: number): string {
		const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
		return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
	}
}

AppleAuthService.register()