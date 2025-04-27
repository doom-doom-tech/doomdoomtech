import {inject, singleton} from "tsyringe";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {CreateAlbumRequest} from "../types/requests";
import AlbumMapper from "../mappers/AlbumMapper";
import {AuthenticatedRequest} from "../../auth/types/requests";
import {AlbumInterface} from "../types";
import {EncodedCursorInterface, PaginationResult} from "../../../common/types/pagination";
import PaginationHandler from "../../../common/classes/api/PaginationHandler";
import {Album, Prisma} from "@prisma/client";
import {IServiceInterface, Service} from "../../../common/services/Service";

export interface AlbumIDRequest {
    albumID: number
}

export interface FindAlbumRequest extends
    AuthenticatedRequest
{
    albumID: number
}

export interface FindUserAlbumsRequest extends EncodedCursorInterface, AuthenticatedRequest {
    userID: number
}

interface AlbumTrackInterface {
    trackID: number
    position: number
}

export interface UpdateAlbumRequest extends
    AlbumIDRequest,
    AuthenticatedRequest
{
    name: string
}

export interface UpdateAlbumTracksRequest extends
    AlbumIDRequest,
    AuthenticatedRequest
{
    name: string
    tracks: Array<AlbumTrackInterface>
}

export interface IAlbumService extends IServiceInterface {
    find(data: FindAlbumRequest): Promise<AlbumInterface>
    user(data: FindUserAlbumsRequest): Promise<PaginationResult<AlbumInterface>>
    create(data: CreateAlbumRequest): Promise<void>
    update(data: Prisma.AlbumUpdateArgs): Promise<void>
}

@singleton()
class AlbumService extends Service implements IAlbumService {

    constructor(
        @inject("Database") protected readonly db: ExtendedPrismaClient
    ) { super() }

    public find = async (data: FindAlbumRequest) => {
        return this.withCache(
            `album:${data.albumID}`,
            async () => AlbumMapper.format(
                await this.db.album.findFirst({
                    where: {
                        id: data.albumID
                    },
                    select: AlbumMapper.getSelectableFields()
                })
            )
        )
    }

    public user = async (data: FindUserAlbumsRequest) => {
        const response = await PaginationHandler.paginate<EncodedCursorInterface, Album>({
            fetchFunction: async (params) => await this.db.album.paginate({
                where: {
                    userID: data.userID
                },
                select: AlbumMapper.getSelectableFields()
            }).withCursor(params),
            data: data,
            pageSize: 10
        })

        return this.withCache(
            `users:${data.userID}:albums:${data.cursor || 'start'}`,
            async () => ({
                ...response,
                data: AlbumMapper.formatMany(response.data)
            })
        )
    }

    public create = async (data: CreateAlbumRequest) => {
        await this.db.$transaction(async (client) => {
            const db = client as ExtendedPrismaClient

            const album = await db.album.create({
                data: {
                    uuid: data.uuid,
                    name: data.name,
                    cover_url: data.cover_url,
                    userID: data.authID,
                }
            })

            for(let [index, track] of data.tracks.entries()) {
                await db.albumTrack.create({
                    data: {
                        trackID: track,
                        position: index,
                        albumID: album.id,
                    }
                })
            }
        })
    }

    public update = async (data: Prisma.AlbumUpdateArgs) => {
        await this.db.album.update({
            where: data.where,
            data: data.data
        });
    }
}

AlbumService.register()