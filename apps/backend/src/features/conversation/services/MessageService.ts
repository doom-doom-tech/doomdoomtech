import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {Prisma} from "@prisma/client";
import {IConversationService} from "./ConversationService";
import {socketInstance} from "../../../common/services/SocketManager";
import {container, inject, singleton} from "tsyringe";
import Singleton from "../../../common/classes/injectables/Singleton";
import MessageMapper from "../mappers/MessageMapper";
import {ConversationInterface} from "../types";
import {IUserService} from "../../user/services/UserService";

export interface IMessageService {
	send(data: SendMessageRequest): Promise<void>;
}

export type SendMessageRequest = Omit<Prisma.MessageCreateArgs['data'], 'conversationID'> & {
	targetID: number;
	senderID: number;
	conversationID?: number;
};

@singleton()
class MessageService extends Singleton implements IMessageService {
	constructor(
		@inject("Database") private db: ExtendedPrismaClient
	) {
		super();
	}

	public send = async (data: SendMessageRequest) => {
		await this.db.$transaction(async (prisma) => {
			const db = prisma as ExtendedPrismaClient;

			if (!data.conversationID) {
				const createdConversation = await this.maybeCreateConversation(data, db);
				data.conversationID = createdConversation.id;
			}

			await this.updateConversationTimestamp(data, db);
			await this.createMessage(data, db);
			await this.sendMessage(data);
		});
	};

	private async sendMessage(data: SendMessageRequest) {
		const userService = container.resolve<IUserService>("UserService");
		const sender = await userService.find({
			authID: data.senderID,
			userID: data.senderID
		});

		socketInstance &&
		(await socketInstance.emitToRoom(`user_${data.senderID}`, 'message', {
			content: data.content,
			username: sender.username,
			conversationID: data.conversationID,
		}));
	}

	private async updateConversationTimestamp(data: SendMessageRequest, db: ExtendedPrismaClient) {
		const conversationService = container.resolve<IConversationService>("ConversationService");
		data.conversationID && (await conversationService.updateLastUpdatedStamp(data.conversationID));
	}

	private async createMessage(data: SendMessageRequest, db: ExtendedPrismaClient) {
		if (!data.conversationID) return;
		return MessageMapper.format(
			await db.message.create({
				data: {
					created: new Date(),
					content: data.content,
					senderID: data.senderID,
					conversationID: data.conversationID,
				},
			})
		);
	}

	private async maybeCreateConversation(data: SendMessageRequest, db: ExtendedPrismaClient): Promise<ConversationInterface> {
		const conversationService = container.resolve<IConversationService>("ConversationService");
		return await conversationService.bindTransactionClient(db).create({
			recipientID: data.targetID,
			authID: data.senderID as number,
		});
	}
}

export default MessageService;