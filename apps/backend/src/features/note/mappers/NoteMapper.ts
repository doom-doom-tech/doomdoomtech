import {Like, Prisma} from "@prisma/client";
import {UserMapper} from "../../user/mappers/UserMapper";
import {TrackMapper} from "../../track/mappers/TrackMapper";
import {TODO} from "../../../common/types";
import {NoteInterface} from "../types";
import _ from "lodash";
import CommentMapper from "../../comment/mappers/CommentMapper";
import {Context} from "../../../common/utils/context";
import {MediaInterface} from "../../media/types";
import {UserInterface} from "../../user/types";

export type SelectableNoteFields = Prisma.NoteGetPayload<{
    select: ReturnType<typeof NoteMapper.getSelectableFields>
}>;

export default class NoteMapper {

    public static getSelectableFields(): Prisma.NoteSelect {
        return {
            id: true,
            uuid: true,
            loop: true,
            likes: true,
            content: true,
            created: true,
            deleted: true,
            likes_count: true,
            comments_count: true,
            loops_count: true,
            media: {
                select: {
                    media: true
                }
            },
            user: {
                select: UserMapper.getSelectableFields()
            },
            track: {
                select: TrackMapper.getSelectableFields()
            },
            looper: {
                select: UserMapper.getSelectableFields()
            },
        }
    }

    public static format(data: TODO): NoteInterface {
        const authID = Context.get('authID')
        const liked = data.likes ? _.some(data.likes, (like: Like) => like.userID === authID) : false

        return {
            id: data.id,
            uuid: data.uuid,
            type: 'Note',
            liked: liked,
            user: data.user,
            content: data.content,
            created: data.created,
            looped: data.loop ?? false,
            looper: data.looper ?? undefined,
            deleted: data.deleted ?? undefined,
            likes_count: data.likes_count ?? 0,
            loops_count: data.loops_count ?? 0,
            comments_count: data.comments_count ?? 0,
            track: data.track ? TrackMapper.format(data.track) : undefined,
            comments: data.comments ? CommentMapper.formatMany(data.comments) : [],
            media: data.media.map((noteMedia: { media: MediaInterface }) => ({
                id: noteMedia.media.id,
                url: noteMedia.media.url,
                type: noteMedia.media.type,
            })),
        }
    }

    public static searchable(data: NoteInterface) {
        return {
            objectID: `note-${data.id}`,
            type: 'note',
            created: Math.floor(new Date(data.created).getTime() / 1000),
            userID: data.user.id,
            users: data.track ? data.track.artists.map((artist: UserInterface) => artist.id) : [],
            content: data.content,
            trackID: data.track ? data.track.id : null,
            likes_count: data.likes_count || 0,
            loops_count: data.loops_count || 0,
        }
    }

    public static formatMany(notes: Array<TODO>) {
        return _.map(notes, note => NoteMapper.format(note))
    }
}