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
	login(payload: OAuthUserInfo): Promise<{user: SingleUserInterface, token: string}>
}

@singleton()
class AppleAuthService extends Service implements IAppleAuthService {

	constructor(
		@inject("Database") protected db: ExtendedPrismaClient,
	) { super() }

	public async findUserByToken(token: string): Promise<SingleUserInterface | null> {
		const response = await this.db.appleUser.findFirst({ where: { token } });

		if (!response) return null;

		return SingleUserMapper.format(
			await this.db.user.findFirst({
				where: { email: response.email },
				select: SingleUserMapper.getSelectableFields(),
			})
		)
	}

	public async login(payload: OAuthUserInfo) {
		try {
			const existingUser = await this
				.findUserByToken(payload.token as string);

			if (existingUser) {
				const jwtToken = this.generateJWT(existingUser.id);
				return { user: existingUser, token: jwtToken };
			}

			const newUser = await this.registerNewUser(payload);
			const jwtToken = this.generateJWT(newUser.id);

			return { user: newUser, token: jwtToken };
		} catch (error) {
			console.error("Apple login error:", error);
			throw new Error("Failed to process Apple login");
		}
	}

	private async registerNewUser(payload: OAuthUserInfo) {
		const authService = container.resolve<IAuthService>("AuthService");

		const username = await this.createUniqueUsername(payload.firstName, payload.lastName);

		await this.db.appleUser.create({
			data: { token: payload.token!, email: payload.email }
		})

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
		return jwt.sign(String(userId), process.env.TOKEN_SECRET as string);
	}

	private generateRandomString(length: number): string {
		const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
		return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
	}
}

AppleAuthService.register()