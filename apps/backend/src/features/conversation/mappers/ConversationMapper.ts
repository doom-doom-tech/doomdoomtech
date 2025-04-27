import {Prisma} from "@prisma/client";
import {UserMapper} from "../../user/mappers/UserMapper";
import {ConversationInterface} from "../types";
import MessageMapper from "./MessageMapper";

export type SelectableConversationFields = Prisma.ConversationGetPayload<{
    select: ReturnType<typeof ConversationMapper.getSelectableFields>
}>;

export default class ConversationMapper {
    public static getSelectableFields(): Prisma.ConversationSelect {
        return {
            created: true,
            updated: true,
            messages: {
                select: MessageMapper.getSelectableFields(),
                take: 1
            },
            users: {
                select: {
                    user: {
                        select: UserMapper.getSelectableFields()
                    }
                }
            }
        }
    }

    public static format(conversation: SelectableConversationFields): ConversationInterface {
        return {
            id: conversation.id,
            created: conversation.created,
            updated: conversation.updated,
            message: conversation.messages && conversation.messages.length > 0
                ? MessageMapper.format(conversation.messages[0])
                : undefined,
            users: UserMapper.formatMany(conversation.users),
        };
    }

    public static formatMany(conversations: Array<SelectableConversationFields>): Array<ConversationInterface> {
        return conversations.map((conversation) => this.format(conversation));
    }
}