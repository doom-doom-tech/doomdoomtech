import {inject, singleton} from "tsyringe";
import {IServiceInterface, Service} from "../../../common/services/Service";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {AuthenticatedRequest} from "../../auth/types/requests";
import NoteMapper, {SelectableNoteFields} from "../mappers/NoteMapper";
import {NoteInterface} from "../types";
import {Note, Prisma} from "@prisma/client";
import {CreateNoteRequest, FetchNotesRequest, FindUserNotesRequest, LikeNoteRequest, NoteIDRequest} from "../types/requests";
import {EncodedCursorInterface, PaginationResult} from "../../../common/types/pagination";
import PaginationHandler from "../../../common/classes/api/PaginationHandler";
import {ILikeService} from "../../like/services/LikeService";
import {container} from "../../../common/utils/tsyringe";
import {ICommentService} from "../../comment/services/CommentService";
import EntityNotFoundError from "../../../common/classes/errors/EntityNotFoundError";
import _ from "lodash";
import {INoteMediaService} from "./NoteMediaService";
import {Context} from "../../../common/utils/context";
import {FetchRankedListRequest} from "../../../common/services/RankedListService";
import {SearchRequestInterface} from "../../search/types/requests";
import {IUserBlockService} from "../../user/services/UserBlockService";
import {IMediaService} from "../../media/services/MediaService";
import {IAlertService} from "../../alert/services/AlertService";
import {IAlgoliaService} from "../../../common/services/AlgoliaService";
import Cachable from "../../../common/classes/cache/Cachable";

interface FetchNoteRequest extends
    NoteIDRequest,
    AuthenticatedRequest
{}

export interface INoteService extends IServiceInterface {
    all(data: FetchNotesRequest): Promise<PaginationResult<NoteInterface>>
    search(data: SearchRequestInterface): Promise<PaginationResult<NoteInterface>>
    like(data: LikeNoteRequest): Promise<void>
    unlike(data: LikeNoteRequest): Promise<void>
    find(data: FetchNoteRequest): Promise<NoteInterface>
    create(data: CreateNoteRequest & AuthenticatedRequest): Promise<NoteInterface | never>
    loop(data: NoteIDRequest & AuthenticatedRequest): Promise<NoteInterface>
    user(data: FindUserNotesRequest): Promise<PaginationResult<NoteInterface>>
    update(data: Prisma.NoteUpdateArgs): Promise<void>
    delete(data: NoteIDRequest): Promise<void>
}

@singleton()
class NoteService extends Service implements INoteService {

    constructor(
        @inject("Database") protected db: ExtendedPrismaClient
    ) { super() }

    public async all(data: FetchNotesRequest){
        const response = await PaginationHandler.paginate<EncodedCursorInterface, Note>({
            fetchFunction: async (params) => await this.db.note.paginate({
                where: this.formatAdditionalWhereClause(data),
                select: NoteMapper.getSelectableFields(),
                orderBy: {
                    created: "desc",
                }
            }).withCursor(params),
            data: data,
            pageSize: 10
        })

        return this.withCache(
            `notes:${_.keys(data).join(':')}`,
            async () => ({
                ...response,
                data: NoteMapper.formatMany(response.data)
            })
        )
    }

    public async find(data: FetchNoteRequest) {

        const commentService = container.resolve<ICommentService>("CommentService");

        let note = await this.db.note.findFirst({
            where: { id: data.noteID },
            select: NoteMapper.getSelectableFields()
        })

        if(!note) throw new EntityNotFoundError("Note")

        _.set(note, 'comments', await commentService.top({
            entityID: data.noteID,
            entity: 'Note'
        }))

        return await this.withCache(
            `notes:${data.noteID}`,
            async () => NoteMapper.format(
                note
            )
        )
    }

    public async create(data: CreateNoteRequest & AuthenticatedRequest) {
        let note: NoteInterface = {} as NoteInterface;

        const algoliaService = container.resolve<IAlgoliaService>("AlgoliaService")

        // Step 1: Create the Note and FeedItem in a transaction
        await this.db.$transaction(async (client) => {
            const db = client as ExtendedPrismaClient;

            const n = await db.note.create({
                select: NoteMapper.getSelectableFields(),
                data: {
                    uuid: data.uuid,
                    content: data.content,
                    userID: data.authID,
                    trackID: data.trackID,
                },
            });

            note = NoteMapper.format(n);

            // Create FeedItem within the transaction if note.id exists
            if (note.id) {
                await db.feedItem.create({
                    data: {
                        entityID: note.id,
                        entityType: "Note",
                        noteID: note.id,
                        users: {
                            create: {
                                user: { connect: { id: data.authID } },
                            },
                        },
                    },
                });
            }
        });

        if(data.attachments) {
            if(_.some(data.attachments, (attachment) => attachment.type === 'Video')) {
                await algoliaService.pushRecord(note)
            } else {
                await algoliaService.pushRecord(note)
            }
        }

        // Step 2: Create NoteMedia records outside the transaction
        if (data.attachments) {
            const mediaService = container.resolve<IMediaService>('MediaService');
            const noteMediaService = container.resolve<INoteMediaService>('NoteMediaService');

            for (let attachment of data.attachments) {
                const media = await mediaService.create({
                    type: attachment.type,
                    url: attachment.url,
                });

                await noteMediaService.create({
                    mediaID: media.id,
                    noteID: note.id,
                });
            }
        }

        await Cachable.deleteMany(["notes:*"]);
        await Cachable.deleteMany([`users:${data.authID}:notes`]);

        return note;
    }

    public async loop(data: NoteIDRequest & AuthenticatedRequest) {
        const noteMediaService = container.resolve<INoteMediaService>("NoteMediaService")
        const relatedNote = await this.find({ noteID: data.noteID, authID: Context.get('authID') })

        const note = NoteMapper.format(
            await this.db.note.create({
                select: NoteMapper.getSelectableFields(),
                data: {
                    loop: true,
                    looperID: data.authID,
                    userID: relatedNote.user.id,
                    content: relatedNote.content,
                    trackID: relatedNote.track?.id,
                }
            })
        )

        note.id && await this.db.feedItem.create({
            data: {
                entityID: note.id,
                entityType: "Note",
                noteID: note.id,
                users: {
                    create: {
                        user: { connect: { id: data.authID } }
                    }
                }
            }
        });

        for(let media of relatedNote.media) {
            await noteMediaService.create({
                noteID: note.id,
                mediaID: media.id
            })
        }

        await Cachable.deleteMany(["notes:*"]);

        return note
    }

    public async like(data: LikeNoteRequest) {
        const likeService = container.resolve<ILikeService>("LikeService")
        await likeService.like({
            entity: 'Note',
            entityID: data.noteID,
            authID: data.authID
        })
    }

    public async unlike(data: LikeNoteRequest) {
        const likeService = container.resolve<ILikeService>("LikeService")
        await likeService.unlike({
            entity: 'Note',
            entityID: data.noteID,
            authID: data.authID
        })
    }

    public async user(data: FindUserNotesRequest) {
        const response = await PaginationHandler.paginate<EncodedCursorInterface, Note>({
            fetchFunction: async (params) => await this.db.note.paginate({
                where: {
                    OR: [
                        {
                            userID: data.userID,
                            loop: false
                        },
                        {
                            looperID: data.userID,
                            loop: true
                        }
                    ]
                },
                select: NoteMapper.getSelectableFields(),
                orderBy: {
                    created: "desc",
                }
            }).withCursor(params),
            data: data,
            pageSize: 10
        })

        return this.withCache(
            `users:${data.userID}:notes:${data.cursor || 'start'}`,
            async () => ({
                ...response,
                data: NoteMapper.formatMany(response.data)
            })
        )
    }

    public async update(data: Prisma.NoteUpdateArgs) {
        await this.db.note.update(data)
    }

    public search = async (data: SearchRequestInterface) => {
        const words = data.query.split(' ');

        const searchConditions: Array<Prisma.NoteWhereInput> = words.map(word => ({
            OR: [
                {user: {username : {contains: word, mode: 'insensitive' as Prisma.QueryMode}}},
                {track: { title: {contains: word, mode: 'insensitive' as Prisma.QueryMode}}},
                {track: { artists: { some: { user: { username : {contains: word, mode: 'insensitive' as Prisma.QueryMode}}}}}}
            ]
        }));

        const userBlockService = container.resolve<IUserBlockService>("UserBlockService")

        const config = {
            select: NoteMapper.getSelectableFields(),
            where: {
                AND: [
                    {
                        OR: searchConditions
                    },
                ],
                NOT: { user: { id: { in: await userBlockService.getBlockedUsers(data)}}}
            } as Prisma.NoteWhereInput
        };

        const response = await PaginationHandler.paginate<EncodedCursorInterface, SelectableNoteFields>({
            fetchFunction: async (params) => await this.db.note.paginate(config).withCursor(params),
            data: data,
            pageSize: 10
        });

        const formattedNotes = NoteMapper.formatMany(response.data);

        return {
            ...response,
            data: formattedNotes
        };
    };

    public async delete(data: NoteIDRequest): Promise<void> {
        const note = await this.db.note.findFirst({
            where: {
                id: data.noteID
            },
            select: {
                id: true,
                media: true,
                userID: true,
            }
        })

        if(!note) throw new EntityNotFoundError("Note")

        await this.db.$transaction(async (client) => {
            const db = client as ExtendedPrismaClient

            const mediaService = container
                .resolve<IMediaService>("MediaService")
                .bindTransactionClient(db)

            const alertService = container
                .resolve<IAlertService>("AlertService")
                .bindTransactionClient(db)

            const algoliaService = container
                .resolve<IAlgoliaService>("AlgoliaService")

            await alertService.deleteWithEntity({
                entityType: "Note",
                entityID: data.noteID
            })

            await db.note.deleteMany({
                where: {
                    id: data.noteID
                }
            })

            await algoliaService.deleteRecord(
                data.noteID,
                "Note"
            )

            //delete relevant media
            for(let media of note.media) {
                await mediaService.delete({
                    id: media.mediaID,
                })
            }

            await Cachable.deleteMany(["notes:*"]);
            note && await Cachable.deleteMany([`users:${note.userID}:notes`]);
        }, {
            timeout: 60000
        })
    }

    private formatAdditionalWhereClause(data: FetchRankedListRequest): Prisma.NoteWhereInput {
        return {
            ...data.userID ? { userID: Number(data.userID) } : {},
            ...data.genreID ? { tracks: { some: { track : { genreID: Number(data.genreID) }}}} : {},
            ...data.labelTag ? { track: { tags: { some: { user: { username: data.labelTag }}}}} : {},
            ...data.subgenreID ? { tracks : { some: { track : { genreID: Number(data.subgenreID)}}}} : {},
        }
    }
}

NoteService.register()