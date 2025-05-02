import {Prisma} from "@prisma/client";
import {SingleUserInterface} from "../types";
import {Context} from "../../../common/utils/context";
import _ from "lodash";

export class SingleUserMapper {
    public static getSelectableFields(): Prisma.UserSelect {
        return {
            id: true,
            bio: true,
            uuid: true,
            email: true,
            label: true,
            credits: true,
            username: true,
            verified: true,
            settings: true,
            tracks_count: true,
            followers_count: true,
            following_count: true,
            avatar_url: true,
            banner_url: true,
            invite_code: {
                select: {
                    usages: true,
                    code: true,
                }
            },
            socials: {
                select: {
                    type: true,
                    url: true,
                }
            },
            followers: {
                where: {
                    userID: Context.get('authID'),
                },
                select: {
                    id: true
                }
            },
        }
    }

    public static format(user: any): SingleUserInterface {
        return {
            id: user.id ?? '',
            bio: user.bio ?? '',
            uuid: user.uuid ?? '',
            email: user.email ?? '',
            label: user.label ?? false,
            socials: user.socials ?? [],
            username: user.username ?? '',
            premium: user.premium ?? false,
            invite_code: user.invite_code ?? '',
            settings: this.formatSettings(user.settings),
            verified: user.verified ?? false,
            credits: user.credits ? user.credits.amount ?? 0 : 0,
            following: user.followers && user.followers.length > 0 || false,
            tracks_count: user.tracks_count ?? 0,
            followers_count: user.followers_count ?? 0,
            following_count: user.following_count ?? 0,
            avatar_url: user.avatar_url ?? null,
            banner_url: user.banner_url ?? null,
        };
    }

    private static formatSettings(settings: Record<string, any>) {
        return{
            events: _.get(settings, 'events', 0)
        }
    }
}