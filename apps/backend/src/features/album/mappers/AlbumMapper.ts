import {Prisma} from "@prisma/client";
import {UserMapper} from "../../user/mappers/UserMapper";
import {AlbumInterface} from "../types";
import _ from "lodash";
import {TODO} from "../../../common/types";

export default class AlbumMapper {

    public static getSelectableFields(): Prisma.AlbumSelect {
        return {
            id: true,
            name: true,
            created: true,
            deleted: true,
            cover_url: true,
            _count: {
                select: {
                    tracks: true
                }
            },
            user: {
                select: UserMapper.getSelectableFields()
            }
        }
    }

    public static format(album: TODO): AlbumInterface {
        return {
            id: album.id,
            type: 'Album',
            uuid: album.uuid,
            name: album.name,
            cover_url: album.cover_url ?? null,
            created: album.created,
            deleted: album.deleted ?? false,
            tracks_count: album._count?.tracks ?? 0,
            user: UserMapper.format(album.user),
        }
    }

    public static formatMany(albums: Array<TODO>) {
        return _.map(albums, album => AlbumMapper.format(album))
    }
}