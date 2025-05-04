import {OAuth2Client} from "google-auth-library";
import {ExtendedPrismaClient} from "../../../../common/utils/prisma";
import * as process from "node:process";
import jwt from "jsonwebtoken";
import {OAuthUserInfo} from "../../types";
import {container, inject, singleton} from "tsyringe";
import Service, {IServiceInterface} from "../../../../common/services/Service";
import {SingleUserInterface} from "../../../user/types";
import {SingleUserMapper} from "../../../user/mappers/SingleUserMapper";
import {IListService} from "../../../list/services/ListService";
import {IAuthService} from "../AuthService";

export interface IGoogleAuthService extends IServiceInterface {
	login(token: string): Promise<{ user: SingleUserInterface, token: string }>;
}

@singleton()
class GoogleAuthService extends Service implements IGoogleAuthService {

	private authClient: OAuth2Client;

	constructor(
		@inject("Database") protected db: ExtendedPrismaClient
	) {
		super();
		this.authClient = new OAuth2Client();
	}

	public async login(token: string) {
		try {
			const userInfo = await this.verifyToken(token);

			const user = await this.findOrCreateUser(userInfo);
			const jwtToken = this.generateJWT(user.id);

			return { user, token: jwtToken };
		} catch (error) {
			console.error("Google login error:", error);
			throw new Error("Failed to process Google login");
		}
	}

	private async findOrCreateUser(userInfo: OAuthUserInfo): Promise<SingleUserInterface> {

		let foundUser = await this.db.user.findUnique({
			where: { email: userInfo.email },
			select: SingleUserMapper.getSelectableFields()
		});

		if (!foundUser) {
			foundUser = await this.registerNewUser(userInfo) as any;
		}

		return SingleUserMapper.format(foundUser);
	}

	private async registerNewUser(userInfo: OAuthUserInfo): Promise<SingleUserInterface> {
		const authService = container.resolve<IAuthService>("AuthService");
		const listService = container.resolve<IListService>("ListService");

		const username = await this.createUniqueUsername(userInfo.firstName, userInfo.lastName);

		const { user } = await authService.signup({
			code: null,
			username,
			email: userInfo.email,
			newsletter: false,
			label: false,
		});

		await listService.create({ userID: user.id, authID: user.id });

		return user;
	}

	private async verifyToken(token: string): Promise<OAuthUserInfo> {
		try {
			const payload = await this.getTokenPayload(token);
			if (!payload) {
				throw new Error("Invalid token payload");
			}

			return {
				email: payload.email!,
				firstName: payload.given_name!,
				lastName: payload.family_name!,
				avatar_url: payload.picture,
			};
		} catch (error) {
			console.error("Token verification failed:", error);
			throw new Error("Failed to verify Google token");
		}
	}

	private async getTokenPayload(token: string) {
		try {
			return (await this.verifyWithClientID(token, process.env.GOOGLE_CLIENT_ID_IOS)).getPayload();
		} catch {
			return (await this.verifyWithClientID(token, process.env.GOOGLE_CLIENT_ID_WEB)).getPayload();
		}
	}

	private async verifyWithClientID(token: string, clientID: string | undefined) {
		if (!clientID) {
			throw new Error("Missing Google client ID");
		}

		return this.authClient.verifyIdToken({
			idToken: token,
			audience: clientID,
		});
	}

	private generateJWT(userId: number | string): string {
		return jwt.sign(String(userId), process.env.TOKEN_SECRET as string);
	}

	private async createUniqueUsername(firstName?: string, lastName?: string): Promise<string> {
		const baseUsername = this.sanitizeUsername(firstName, lastName);
		return this.ensureUniqueUsername(baseUsername);
	}

	private sanitizeUsername(firstName?: string, lastName?: string): string {
		const base = `${firstName || ""}${lastName || ""}`.toLowerCase();
		return base.replace(/\s+/g, "").replace(/[^a-z0-9_]/g, "") || `user_${this.generateRandomString(8)}`;
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

	private generateRandomString(length: number): string {
		const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
		return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
	}
}

GoogleAuthService.register();