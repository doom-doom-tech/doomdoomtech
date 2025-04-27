import Service, {IServiceInterface} from "../../../common/services/Service";
import {container, inject, Lifecycle, scoped} from "tsyringe";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {EncodedCursorInterface, PaginationResult} from "../../../common/types/pagination";
import EntityNotFoundError from "../../../common/classes/errors/EntityNotFoundError";
import PaginationHandler from "../../../common/classes/api/PaginationHandler";
import {Context} from "../../../common/utils/context";
import ValidationError from "../../../common/classes/errors/ValidationError";
import {Conversation} from "@prisma/client";

import {AuthenticatdConversationRequest, CreateConversationRequest, FindConversationMessagesRequest, FindConversationRequest, FindConversationUsersRequest, FindManyConversationsRequest,} from "../types/requests";

import {ITrackService} from "../../track/services/TrackService";
import ConversationMapper from "../mappers/ConversationMapper";
import {ConversationInterface, MessageInterface} from "../types";
import {UserMapper} from "../../user/mappers/UserMapper";
import {UserInterface} from "../../user/types";
import MessageMapper from "../mappers/MessageMapper";
import {AuthenticatedRequest} from "../../auth/types/requests";

export interface IConversationService extends IServiceInterface {
	authorized(data: { userID: number, conversationID: number }): Promise<boolean>;
	find(data: FindConversationRequest): Promise<ConversationInterface>;
	create(data: CreateConversationRequest): Promise<ConversationInterface>;
	users(data: FindConversationUsersRequest): Promise<Array<UserInterface>>;
	fromUsers(recipientID: number, authID: number): Promise<Conversation | null>;
	findMany(data: FindManyConversationsRequest): Promise<PaginationResult<ConversationInterface>>;
	messages(data: FindConversationMessagesRequest): Promise<PaginationResult<MessageInterface>>;
	unreadMessagesCount(data: AuthenticatdConversationRequest): Promise<number>;
	unreadConversationsCount(data: AuthenticatedRequest): Promise<number>;
	updateLastUpdatedStamp(conversationID: number): Promise<void>;
}

@scoped(Lifecycle.ResolutionScoped)
class ConversationService extends Service implements IConversationService {
	constructor(
		@inject("Database") protected db: ExtendedPrismaClient
	) {
		super();
	}

	public find = async (data: FindConversationRequest) => {
		const conversation = await this.db.conversation.findFirst({
			select: ConversationMapper.getSelectableFields(),
			where: {
				id: data.conversationID,
			}
		});

		if (!conversation) throw new EntityNotFoundError("Conversation");

		return this.withCache(
			`conversations:${data.conversationID}`,
			async () => ConversationMapper.format(conversation)
		);
	};

	public async findMany(data: FindManyConversationsRequest) {
		const response = await PaginationHandler.paginate<EncodedCursorInterface, any>({
			fetchFunction: (params) => this.db.conversation.paginate({
				select: ConversationMapper.getSelectableFields(),
				where: {
					users: {
						some: {
							userID: Context.get("authID")
						}
					}
				}
			}).withCursor(params),
			data: data,
			pageSize: 10
		});

		return this.withCache(
			`conversations:${Context.get("authID")}`,
			async () => ({
				...response,
				data: ConversationMapper.formatMany(response.data)
			})
		);
	}

	public fromUsers = async (recipientID: number, authID: number) => {
		return await this.db.conversation.findFirst({
			select: ConversationMapper.getSelectableFields(),
			where: {
				AND: [
					{ users: { some: { userID: recipientID } } },
					{ users: { some: { userID: authID } } },
				]
			}
		});
	};

	public create = async (data: CreateConversationRequest): Promise<ConversationInterface> => {
		const existingConversation = await this.fromUsers(data.recipientID, data.authID);
		if (existingConversation) return ConversationMapper.format(existingConversation);

		const usersExist = await Promise.all([
			this.db.user.findUnique({ where: { id: data.authID } }),
			this.db.user.findUnique({ where: { id: data.recipientID } }),
		]);

		if (usersExist.some((user) => !user)) {
			throw new ValidationError("One or both users do not exist");
		}

		const newConversation = await this.db.conversation.create({
			data: {
				users: {
					create: [
						{ user: { connect: { id: data.authID } } },
						{ user: { connect: { id: data.recipientID } } },
					],
				},
			},
			select: ConversationMapper.getSelectableFields()
		});

		return ConversationMapper.format(newConversation);
	};

	public users = async (data: FindConversationUsersRequest) => {
		if (!data.conversationID) throw new EntityNotFoundError('Conversation');

		return this.withCache(
			`conversations:${data.conversationID}:users`,
			async () => UserMapper.formatMany(
				await this.db.conversationUser.findMany({
					select: {
						user: {
							select: UserMapper.getSelectableFields(),
						}
					},
					where: {
						conversationID: data.conversationID
					}
				})
			)
		);
	};

	public messages = async (data: FindConversationMessagesRequest) => {
		const response = await PaginationHandler.paginate<EncodedCursorInterface, any>({
			fetchFunction: async (params) => this.db.message.paginate({
				where: { conversationID: data.conversationID },
				select: MessageMapper.getSelectableFields(),
				orderBy: { created: 'desc' }
			}).withCursor(params),
			data: data,
			pageSize: 10
		});

		await this.populateMessageEntities(response, Context.get('authID'));

		return {
			...response,
			data: MessageMapper.formatMany(response.data)
		};
	};

	public async unreadMessagesCount(data: AuthenticatdConversationRequest) {
		return await this.db.message.count({
			where: {
				AND: [
					{ conversationID: data.conversationID },
					{ senderID: { not: Context.get('authID') } },
					{ seen: false }
				]
			}
		});
	}

	public async unreadConversationsCount(data: AuthenticatedRequest) {
		return await this.db.conversation.count({
			where: {
				users: {
					some: {
						userID: Context.get('authID')
					}
				},
				messages: {
					some: {
						AND: [
							{ senderID: { not: Context.get('authID') } },
							{ seen: false }
						]
					}
				}
			}
		});
	}

	public async updateLastUpdatedStamp(conversationID: number) {
		await this.db.conversation.update({
			where: { id: conversationID },
			data: { updated: new Date() }
		});
	}

	public async authorized(data: { userID: number, conversationID: number }): Promise<boolean> {
		return Boolean(await this.db.conversationUser.findFirst({
			where: data
		}));
	}

	private async populateMessageEntities(response: any, authID: number) {
		const trackService = container.resolve<ITrackService>("TrackService");
		for (const message of response.data) {
			if (message.entityID) {
				message.entity = await trackService.find({ trackID: message.entityID, authID });
			}
		}
	}
}

ConversationService.register()