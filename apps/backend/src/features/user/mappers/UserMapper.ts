import {Prisma} from "@prisma/client";
import {TODO} from "../../../common/types";
import {UserInterface} from "../types";
import {Context} from "../../../common/utils/context";

export type SelectableUserFields = Prisma.UserGetPayload<{
    select: ReturnType<typeof UserMapper.getSelectableFields>
}>;

export class UserMapper {

    public static getSelectableFields(): Prisma.UserSelect {
        return {
            id: true,
            uuid: true,
            email: true,
            label: true,
            username: true,
            verified: true,
            tracks_count: true,
            avatar_url: true,
            premium: true,
            followers: {
                where: {
                    userID: Context.get('authID'),
                },
                select: {
                    id: true
                }
            }
        }
    }

    public static format(user: TODO): UserInterface {
        return {
            id: user.id ?? '',
            uuid: user.uuid ?? '',
            email: user.email ?? '',
            label: user.label ?? false,
            premium: user.premium,
            username: user.username ?? '',
            verified: user.verified ?? false,
            following: user.followers ? user.followers.length > 0 : false,
            tracks_count: user.tracks_count ?? 0,
            avatar_url: user.avatar_url ?? null,
        };
    }

    public static formatMany(users: TODO[]): UserInterface[] {
        return users.map(user => UserMapper.format(user));
    }
}