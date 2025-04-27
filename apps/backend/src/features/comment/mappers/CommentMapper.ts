import {Like, Prisma} from "@prisma/client";
import {UserMapper} from "../../user/mappers/UserMapper";
import {CommentInterface} from "../types";
import {TODO} from "../../../common/types";
import _ from "lodash";
import {Context} from "../../../common/utils/context";

interface SelectableCommentFieldsRequest {
    authID: number
}

export type SelectableCommentFields = Prisma.CommentGetPayload<{
    select: Prisma.CommentSelect
}>;

export default class CommentMapper {

    public static getSelectableFields(): Prisma.CommentSelect {
        return {
            id: true,
            sender: {
                select: UserMapper.getSelectableFields()
            },
            likes: true,
            content: true,
            created: true,
            deleted: true,
            entity: true,
            entityID: true,
            parentID: true,
            likes_count: true,
        }
    }

    public static format(data: TODO): CommentInterface {
        const authID = Context.get('authID')
        const liked = data.likes ? _.some(data.likes, (like: Like) => like.userID === authID) : false

        return {
            id: data.id,
            content: data.content,
            created: data.created,
            entity: data.entity,
            entityID: data.entityID ?? 0,
            deleted: data.deleted ?? null,
            liked: liked ?? false,
            likes: data.likes_count ?? 0,
            parentID: data.parentID ?? undefined,
            sender: UserMapper.format(data.sender),
        }
    }

    public static formatMany(items: Array<TODO>): Array<CommentInterface> {
        return _.map(items, data => CommentMapper.format(data))
    }
}