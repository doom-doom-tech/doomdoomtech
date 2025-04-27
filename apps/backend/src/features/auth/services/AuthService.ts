import jwt from "jsonwebtoken";
import EntityNotFoundError from "../../../common/classes/errors/EntityNotFoundError";
import ValidationError from "../../../common/classes/errors/ValidationError";
import prisma, {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {randomBytes} from 'crypto';
import {WELCOMEMESSAGE} from "../../../common/constants/DMS";
import {container, inject, injectable} from "tsyringe";
import {AuthorizeRequest, DeleteAuthorizationCodeRequest, DeletePasswordResetTokenRequest, LoginRequest, RegistrationRequestInterface, VerifyAuthorizationCodeRequest} from "../types/requests";
import {EmailConfig, IEmailService} from "../../email/services/EmailService";
import {DDT_ACCOUNT_ID} from "../../../common/constants";
import Service from "../../../common/services/Service";
import {INotificationService} from "../../notification/services/NotificationService";
import {IMessageService} from "../../conversation/services/MessageService";
import {IConversationService} from "../../conversation/services/ConversationService";
import {IAuthQueue} from "../queues/AuthQueue";
import {IMailchimpService} from "../../email/services/MailchimpService";
import {IListService} from "../../list/services/ListService";
import {IUserService} from "../../user/services/UserService";
import {SingleUserInterface} from "../../user/types";
import {SingleUserMapper} from "../../user/mappers/SingleUserMapper";
import {ICreditsService} from "../../credits/services/CreditsService";
import {CREDIT_VALUES} from "../../../common/constants/credits";
import _ from "lodash";

export interface IAuthService {
	request(data: LoginRequest): Promise<void>
	authorize(data: AuthorizeRequest): Promise<{ user: SingleUserInterface, token: string }>
	signup(data: RegistrationRequestInterface): Promise<{ user: SingleUserInterface, token: string }>
	deleteAuthorizationCode(data: DeleteAuthorizationCodeRequest): Promise<void>
	sendVerificationEmail(email: string): Promise<void>
	verifyEmail(email: string, token: string): Promise<void>
	sendWelcomeMessage(recipientID: number): Promise<void>
}

@injectable()
class AuthService extends Service implements IAuthService {

	constructor(
		@inject("Database") protected db: ExtendedPrismaClient
	) { super() }

	public request = async (data: LoginRequest): Promise<void> => {
		const {email} = data;
		if (!email) throw new ValidationError('Email is required');

		const user = await this.withCache(
			`user:${email}`,
			async () => {
				return await this.db.user.findFirst({where: {email}})
			}
		)

		if (!user)
			throw new EntityNotFoundError('User');

		if (!user.email_verified)
			throw new ValidationError('Please verify your email before logging in. Make sure to check your spam inbox too!');

		let code = String(Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000)

		if(email === 'apple@doomdoom.tech') code = '000000'

		await this.db.authorizationCode.upsert({
			where: {
				email
			},
			create: {
				email,
				code
			},
			update: {
				code
			}
		})

		// Temporary fix for app store reviews - skip emails
		if(email === 'apple@doomdoom.tech') return

		const authQueue = container.resolve<IAuthQueue>("AuthQueue");
		const emailService = container.resolve<IEmailService>("EmailService");

		const config: EmailConfig = {
			from: 'DoomDoomTech <support@doomdoom.tech>',
			to: data.email,
			subject: "Your one-time login code",
			template: '/emails/auth/authorization/index.html',
			variables: { email: data.email, code: code },
		};

		await authQueue.scheduleDeleteAuthorizationCodeJob({ email: data.email });
		// await emailService.send(config);
	}

	public authorize = async (data: VerifyAuthorizationCodeRequest) => {
		const {email, code} = data;

		if (!email)
			throw new ValidationError('Email is required');

		if (!code)
			throw new ValidationError('Code is required');

		const record = await this.db.authorizationCode.findFirst({
			where: { code, email }
		})

		if(!record)
			throw new ValidationError('Code is invalid');

		const user = SingleUserMapper.format(
			await this.db.user.findFirst({
				select: SingleUserMapper.getSelectableFields(),
				where: {email}}
			)
		)

		await this.deleteAuthorizationCode({ email })

		const token = jwt.sign(String(user.id), process.env.TOKEN_SECRET as string);
		return { user, token };
	}

	public signup = async (data: RegistrationRequestInterface) => {
		const userService = container.resolve<IUserService>("UserService");
		const listService = container.resolve<IListService>("ListService");
		const creditsService = container.resolve<ICreditsService>("CreditsService");
		const mailchimpService = container.resolve<IMailchimpService>("MailchimpService");

		const user = await userService.create(_.omit(data, 'label'));
		const token = jwt.sign(String(user.id), process.env.TOKEN_SECRET as string);

		await listService.create({ userID: user.id, authID: user.id });

		await creditsService.create(user.id)

		await prisma.userSettings.create({
			data: {
				userID: user.id,
				invite_code_used: data.code || undefined
			}
		})

		// Automatically follow ddt account
		await prisma.follow.create({
			data: {
				userID: user.id,
				followsID: 102
			}
		})

		if (data.newsletter) {
			// Don't await this since it's still throwing a 404 error on Mailchimp's side
			mailchimpService.addSubscribersToList("newsLetter", [{
				email_address: data.email,
				email_type: 'html',
				status: 'subscribed'
			}]);
		}

		if(data.label) {
			const emailService = container.resolve<IEmailService>("EmailService");

			const config: EmailConfig = {
				from: 'DoomDoomTech <support@doomdoom.tech>',
				to: data.email,
				subject: "Verify your label",
				template: '/emails/auth/verify-label/index.html',
				variables: { email: data.email, username: data.username },
			};

			await emailService.send(config);

			await this.db.labelVerification.create({
				data: {
					userID: user.id,
					status: 'Pending'
				}
			})
		}

		await this.db.inviteCode.create({
			data: {
				userID: user.id,
				code: randomBytes(4).toString("hex").toUpperCase()
			}
		})

		await this.sendVerificationEmail(data.email);
		await this.sendWelcomeMessage(user.id);

		return { user, token };
	}

	public deletePasswordTokenRecord = async (data: DeletePasswordResetTokenRequest) => {
		await this.db.passwordResetTokens.deleteMany({ where: { email: data.email } });
	}

	public deleteAuthorizationCode = async (data: DeletePasswordResetTokenRequest) => {
		await this.db.authorizationCode.deleteMany({ where: { email: data.email } });
	}

	public sendVerificationEmail = async (email: string) => {
		const user = await this.db.user.findFirst({ where: { email } });

		if (!user) throw new ValidationError('We can\'t find a user with this email');

		const emailService = container.resolve<IEmailService>("EmailService");
		const authQueue = container.resolve<IAuthQueue>("AuthQueue");

		const token = randomBytes(32).toString('hex');

		await this.db.verifyEmailToken.upsert({
			where: { email },
			update: { token },
			create: { email, token }
		});

		const config: EmailConfig = {
			from: 'DoomDoomTech <support@doomdoom.tech>',
			to: email,
			subject: "Verify your email",
			template: '/emails/auth/verify-email/index.html',
			variables: { email, token, username: user.username }
		};

		await authQueue.scheduleDeleteVerificationTokenJob({ email });
		await emailService.send(config);
	}

	public sendWelcomeMessage = async (recipientID: number) => {
		const conversationService = container.resolve<IConversationService>("ConversationService");
		const messageService = container.resolve<IMessageService>("MessageService");
		const notificationService = container.resolve<INotificationService>("NotificationService");

		const createdConversation = await conversationService.create({
			authID: DDT_ACCOUNT_ID, recipientID
		});

		await messageService.send({
			senderID: DDT_ACCOUNT_ID,
			content: WELCOMEMESSAGE,
			targetID: recipientID
		});

		await notificationService.send({
			action: 'Info',
			entityType: 'User',
			body: WELCOMEMESSAGE,
			targetID: recipientID,
			userID: DDT_ACCOUNT_ID,
			title: 'Welcome to DDT',
			entityID: DDT_ACCOUNT_ID,
			data: { "url": `/conversations/${createdConversation.id}` }
		});
	}

	public verifyEmail = async (email: string, token: string) => {
		const verificationRecord = await this.db.verifyEmailToken.findUnique({where: {email}});

		if (!verificationRecord) throw new ValidationError('Verification token not found or expired');
		if (verificationRecord.token !== token) throw new ValidationError('Invalid verification token');

		const user = await this.db.user.findFirst({ where: { email }, select: {
			 settings: true
			}
		});

		if(user && user.settings && user.settings.invite_code_used) {
			const creditsService = container.resolve<ICreditsService>("CreditsService");

			const inviteCode = await this.db.inviteCode.findFirst({
				where: {
					code: user.settings.invite_code_used
				}
			})

			if(inviteCode && inviteCode.usages === 5) {
				const inviter =  await this.db.user.findFirst({
					select: SingleUserMapper.getSelectableFields(),
					where: {
						invite_code: {
							code: user.settings.invite_code_used
						}
					}
				})

				inviter && await creditsService.add({
					userID: inviter.id,
					amount: CREDIT_VALUES.invite
				})

				inviter && await this.db.inviteCode.update({
					where: {
						userID: inviter.id,
					},
					data: {
						usages: {
							increment: 1
						}
					}
				})
			}
		}

		await this.db.user.update({
			where: {email},
			data: {email_verified: true}
		});

		await this.db.verifyEmailToken.delete({where: {email}});
	}
}

AuthService.register()