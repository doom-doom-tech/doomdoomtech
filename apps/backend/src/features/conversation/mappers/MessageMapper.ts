import {Prisma} from "@prisma/client";
import {UserMapper} from "../../user/mappers/UserMapper";
import {MessageInterface} from "../types";
import _ from "lodash";
import {TODO} from "../../../common/types";

export type SelectableMessageFields = Prisma.MessageGetPayload<{
    select: ReturnType<typeof MessageMapper.getSelectableFields>
}>;

export default class MessageMapper {

    public static getSelectableFields(): Prisma.MessageSelect {
        return {
            type: true,
            created: true,
            updated: true,
            content: true,
            sender: {
                select: UserMapper.getSelectableFields()
            },
        }
    }

    public static format(data: TODO): MessageInterface {
        return {
            type: data.type ?? 'Text',
            content: data.content ?? '',
            senderID: data.senderID ?? 0,
            created: data.created ?? new Date(),
            updated: data.updated ?? new Date(),
        }
    }

    public static formatMany(messages: Array<TODO>) {
        return _.map(messages, data => ({
            type: data.type ?? 'Text',
            content: data.content ?? '',
            senderID: data.senderID ?? 0,
            created: data.created ?? new Date(),
            updated: data.updated ?? new Date(),
        }))
    }
}