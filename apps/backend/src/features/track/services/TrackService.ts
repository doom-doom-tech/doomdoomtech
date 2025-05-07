import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import PaginationHandler from "../../../common/classes/api/PaginationHandler";
import {EncodedCursorInterface, PaginationResult} from "../../../common/types/pagination";
import {Prisma} from "@prisma/client";
import {inject, singleton} from "tsyringe";
import {TrackMapper} from "../mappers/TrackMapper";
import EntityNotFoundError from "../../../common/classes/errors/EntityNotFoundError";
import {IUserBlockService} from "../../user/services/UserBlockService";
import {ICollabRequestService} from "../../collab/services/CollabRequestService";
import {IUserService} from "../../user/services/UserService";
import {CreateTrackRequest, FetchTracksRequest, FetchUserTracksRequest, FindTrackRequest, SearchTrackRequest, TrackIDRequest} from "../types/requests";
import {TrackInterface} from "../types";
import {INotificationService} from "../../notification/services/NotificationService";
import {FetchRankedListRequest} from "../../../common/services/RankedListService";
import _ from "lodash";
import {getDateRangeForPeriod, getScoreColumnForPeriod} from "../../../common/utils/utilities";
import Service, {IServiceInterface} from "../../../common/services/Service";
import {container} from "../../../common/utils/tsyringe";
import {IGenreService} from "../../genre/services/GenreService";
import {ITrackTagService} from "./TrackTagService";
import {ITrackPopularityService} from "./TrackPopularityService";
import {INoteService} from "../../note/services/NoteService";
import {ITrackScoringService} from "./TrackScoringService";
import {Context} from "../../../common/utils/context";
import {CREDIT_VALUES} from "../../../common/constants/credits";
import {ICreditsService} from "../../credits/services/CreditsService";
import {IMediaCompressionService} from "../../media/services/MediaCompressionService";
import {IMediaService} from "../../media/services/MediaService";
import {ITrackBoostService} from "./TrackBoostService";
import {ITrackWaveformService} from "./TrackWaveformService";
import {IAlgoliaService} from "../../../common/services/AlgoliaService";
import {SingleUserInterface} from "../../user/types";
import {TrackQueue} from "../queues/TrackQueue";
import {IQueue} from "../../../common/types";
import {PrepareNotifyFollowersNewUploadPayload} from "../jobs/PrepareNotifyFollowersNewUpload";
import SocketManager from "../../../common/services/SocketManager";

export interface ITrackService extends IServiceInterface {
    all(data: FetchTracksRequest): Promise<PaginationResult<TrackInterface>>
    find(data: FindTrackRequest): Promise<TrackInterface>
    search(data: SearchTrackRequest): Promise<PaginationResult<TrackInterface>>
    create(data: CreateTrackRequest): Promise<TrackInterface>
    user(data: FetchUserTracksRequest): Promise<PaginationResult<TrackInterface>>
    latest(data: FetchRankedListRequest): Promise<PaginationResult<TrackInterface>>
    bestRated(data: FetchRankedListRequest): Promise<PaginationResult<TrackInterface>>
    mostListened(data: FetchRankedListRequest): Promise<PaginationResult<TrackInterface>>
    latestVideos(data: FetchRankedListRequest): Promise<PaginationResult<TrackInterface>>
    mostPopular(data: FetchRankedListRequest): Promise<PaginationResult<TrackInterface>>
    delete(data: TrackIDRequest): Promise<void>
}

@singleton()
class TrackService extends Service implements ITrackService {

    constructor(
        @inject("Database") protected db: ExtendedPrismaClient,
        @inject("UserService") private userService: IUserService,
        @inject("UserBlockService") private userBlockService: IUserBlockService,
        @inject("CollabRequestService") private collabRequestService: ICollabRequestService,
        @inject("NotificationService") private notificationService: INotificationService,
    ) { super() }

    public async all(data: FetchTracksRequest) {
        const response = await PaginationHandler.paginate({
            fetchFunction: async (params) => await this.db.track.paginate({
                select: TrackMapper.getSelectableFields(),
                where: {
                    OR: [
                        {
                            title: { contains: data.query, mode: 'insensitive' },
                        },
                        {
                            artists: {
                                some: {
                                    user: {
                                        username: {
                                            contains: data.query, mode: 'insensitive'
                                        }
                                    }
                                }
                            },
                        },
                    ]
                }
            }).withCursor(params),
            data: data,
            pageSize: 10
        });

        let tracks = response.data;

        return {
            ...response,
            data: TrackMapper.formatMany(tracks)
        };
    }

    public async find (data: FindTrackRequest) {
        const track = await this.db.track.findFirst({
            select: TrackMapper.getSelectableFields(),
            where: {
                deleted: false,
                id: data.trackID
            }
        })

        if(!track) throw new EntityNotFoundError('Track')

        return await this.withCache(
            `tracks:${data.trackID}:${data.authID === 0}`,
            async () => TrackMapper.format(track)
        )
    }

    public async user(data: FetchUserTracksRequest) {
        const response = await PaginationHandler.paginate({
            fetchFunction: async (params) => await this.db.track.paginate({
                select: TrackMapper.getSelectableFields(),
                where: {
                    deleted: false,
                    ...data.query ? { title: { contains: data.query, mode: "insensitive" } } : null,
                    artists: {
                        some: {
                            userID: data.userID,
                        }
                    }
                }
            }).withCursor(params),
            data: data,
            pageSize: 10
        })

        return {
            ...response,
            data: TrackMapper.formatMany(response.data)
        }
    }

    public async search  (data: SearchTrackRequest) {

        const words = data.query.split(' ');

        const titleSearchConditions = words.map(word => ({
            title: {
                contains: word,
                mode: 'insensitive'
            }
        }))

        const artistSearchConditions = words.map(word => ({
            artists: {
                some: {
                    user: {
                        username: {
                            contains: word,
                            mode: 'insensitive'
                        }
                    }

                }
            }
        }))

        const config = {
            select: TrackMapper.getSelectableFields(),
            where: {
                active: true,
                deleted: false,
                NOT: {
                    artists: {
                        some: {
                            userID: {
                                in: await this.userBlockService.getBlockedUsers(data)
                            }
                        }
                    }
                },
                OR: [
                    ...titleSearchConditions,
                    ...artistSearchConditions,
                ]
            } as Prisma.TrackWhereInput
        };

        const response =  await PaginationHandler.paginate<EncodedCursorInterface, {}>({
            fetchFunction: async (params) => await this.db.track.paginate(config).withCursor(params),
            data: data,
            pageSize: 10
        })

        return {
            ...response,
            data: TrackMapper.formatMany(response.data)
        }
    }

    public async create(data: CreateTrackRequest) {
        const genreService = container.resolve<IGenreService>('GenreService')
        const parentGenre = await genreService.findParent(data.subgenreID)

        let audioURL = data.audio_url || ''

        const mainArtist: SingleUserInterface = await this.userService.find({
            userID: data.authID, authID: data.authID
        })

        const track = await this.db.track.create({
            select: TrackMapper.getSelectableFields(),
            data: {
                uuid: data.uuid,
                explicit: data.explicit,
                caption: data.caption,
                title: data.title,
                genreID: parentGenre.id,
                main_artist: data.authID,
                subgenreID: data.subgenreID,
                active: data.title !== 'Test',
                audio_url: data.audio_url ?? undefined,
                video_url: data.video_url ?? undefined,
                cover_url: data.cover_url ?? undefined,
            }
        })

        // If the track has a video url, extract the audio and update the track
        if(data.video_url && !data.audio_url) {
            const mediaService = container
                .resolve<IMediaService>('MediaService')

            const mediaCompressionService = container
                .resolve<IMediaCompressionService>('MediaCompressionService')

            const signedURL = await mediaService
                .uploadBuffer(await mediaCompressionService.extract(data.video_url), 'audio.mp3', track.uuid, 'audio/mpeg')

            audioURL = signedURL

            await this.db.track.update({
                where: {
                    uuid: track.uuid
                },
                data: {
                    audio_url: signedURL
                }
            })
        }

        await this.db.$transaction(async (client) => {
            const db = client as ExtendedPrismaClient

            const trackQueue = container.resolve<IQueue>("TrackQueue")
            const algoliaService = container.resolve<IAlgoliaService>("AlgoliaService")

            const creditsService = container.resolve<ICreditsService>("CreditsService").bindTransactionClient(db);
            const trackTagService = container.resolve<ITrackTagService>("TrackTagService").bindTransactionClient(db)
            const trackBoostService = container.resolve<ITrackBoostService>("TrackBoostService").bindTransactionClient(db)
            const trackScoreService = container.resolve<ITrackScoringService>("TrackScoringService").bindTransactionClient(db)
            const trackPopularityService = container.resolve<ITrackPopularityService>("TrackPopularityService").bindTransactionClient(db)
            const trackWaveformService = container.resolve<ITrackWaveformService>('TrackWaveformService').bindTransactionClient(db)

            for(let tag of data.tags) {
                await trackTagService.create({
                    trackID: track.id,
                    userID: tag
                })
            }

            await db.trackMetadata.create({
                data: {
                    trackID: track.id,
                }
            })

            await trackWaveformService.createWaveform({
                uuid: track.uuid, source: audioURL
            })

            audioURL && await trackBoostService.metadata(
                track.uuid,
                audioURL
            )

            if(_.some(data.services, service => service === 'mastering') && audioURL) {
                await trackBoostService.mastering(
                    track.uuid,
                    audioURL
                )
            }

            await creditsService.add({
                userID: Context.get("authID"),
                amount: CREDIT_VALUES.upload
            })

            await trackScoreService.create({
                trackID: track.id,
            })

            await trackPopularityService.create({
                trackID: track.id,
            })

            await db.feedItem.create({
                data: {
                    entityID: track.id,
                    entityType: "Track",
                    trackID: track.id,
                    users: {
                        create: {
                            user: { connect: { id: data.authID } }
                        }
                    }
                }
            })

            // Alert all followers of the artist about the new upload
            await trackQueue.addJob<PrepareNotifyFollowersNewUploadPayload>('PrepareNotifyFollowersNewUpload', {
                artist: mainArtist,
                trackID: track.id
            })

            await algoliaService.pushRecord(TrackMapper.format(track))

            for (let artist of data.artists) {
                if(artist.userID === data.authID) {
                    await this.userService.update({
                        where: {
                            id: artist.userID
                        },
                        data: {
                            tracks_count: {
                                increment: 1
                            }
                        }
                    })

                    await db.trackArtist.create({
                        data: {
                            role: artist.role,
                            royalties: artist.royalties,
                            userID: data.authID,
                            trackID: track.id
                        }
                    })

                    continue
                }

                await this.collabRequestService.create({
                    role: artist.role,
                    trackID: track.id,
                    senderID: data.authID,
                    targetID: artist.userID,
                    royalties: artist.royalties
                })

                await this.notificationService.trigger({
                    action: 'Collab',
                    body: "requests to collab with you",
                    data: {},
                    entityID: track.id,
                    entityType: 'Track',
                    title: mainArtist!.username,
                    userID: data.authID,
                    targetID: artist.userID
                })
            }
        }, {
            maxWait: 60000,
            timeout: 60000
        })

        if(data.note && track) {
            const noteService = container.resolve<INoteService>("NoteService")

            const note = await noteService.create({
                content: data.note!,
                authID: data.authID,
                trackID: track.id
            })
        }

        const formattedTrack = TrackMapper.format(track);

        // // Emit socket event for track creation
        const socketManager = container.resolve<SocketManager>("SocketManager");
        socketManager && await socketManager.emitToRoom(`user_${data.authID}`, 'track:upload:complete', {})

        return formattedTrack
    }

    public async latest (data: FetchRankedListRequest) {
        let response = await PaginationHandler.paginate({
            fetchFunction: async (params) => await this.db.track.paginate({
                select: TrackMapper.getSelectableFields(),
                where: {
                    active: true,
                    deleted: false,
                    AND: [
                        await this.formatAdditionalWhereClause(data),
                        {
                            NOT: {
                                artists: {
                                    some: {
                                        userID: {
                                            in: await this.userBlockService.getBlockedUsers(data)
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                orderBy: [
                    {
                        created: 'desc'
                    },
                    {
                        id: 'desc'
                    }
                ],
            }).withCursor(params),
            data: {cursor: data.cursor},
            pageSize: 10
        })

        return {
            ...response,
            data: TrackMapper.formatMany(response.data)
        }
    }

    public async bestRated (data: FetchRankedListRequest) {
        const response = await PaginationHandler.paginate({
            fetchFunction: async (params) => await this.db.trackScore.paginate({
                where: {
                    track: {
                        active: true,
                        deleted: false,
                        AND: [
                            await this.formatAdditionalWhereClause(data),
                            {
                                NOT: {
                                    artists: {
                                        some: {
                                            userID: {
                                                in: await this.userBlockService.getBlockedUsers(data)
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    }
                },
                select: {
                    id: true,
                    track: {
                        select: TrackMapper.getSelectableFields(),
                    }
                },
                orderBy: {
                    [getScoreColumnForPeriod(data.period)]: 'desc',
                }
            }).withCursor(params),
            data: data,
            pageSize: 10
        })

        return {
            ...response,
            data: TrackMapper.formatMany(_.map(response.data, trackScore => trackScore.track))
        }
    }

    public async latestVideos(data: FetchRankedListRequest) {
        const response = await PaginationHandler.paginate({
            fetchFunction: async (params) => await this.db.track.paginate({
                where: {
                    created: getDateRangeForPeriod(data.period),
                    active: true,
                    deleted: false,
                    video_url: {
                        not: null,
                    },
                    AND: [
                        await this.formatAdditionalWhereClause(data),
                        {
                            NOT: {
                                artists: {
                                    some: {
                                        userID: {
                                            in: await this.userBlockService.getBlockedUsers(data)
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                select: TrackMapper.getSelectableFields(),
                orderBy: [
                    {
                        created: 'desc'
                    },
                    {
                        id: 'desc'
                    }
                ]
            }).withCursor(params),
            data: data,
            pageSize: 10
        })

        return {
            ...response,
            data: TrackMapper.formatMany(response.data)
        }
    }

    public async mostListened(data: FetchRankedListRequest) {
        const response = await PaginationHandler.paginate({
            fetchFunction: async (params) => await this.db.trackPlay.paginate({
                where: {
                    created: getDateRangeForPeriod(data.period),
                    track: {
                        active: true,
                        deleted: false,
                        AND: [
                            await this.formatAdditionalWhereClause(data),
                            {
                                NOT: {
                                    artists: {
                                        some: {
                                            userID: {
                                                in: await this.userBlockService.getBlockedUsers(data)
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    }
                },
                select: {
                    id: true,
                    track: {
                        select: TrackMapper.getSelectableFields(),
                    }
                },
                orderBy: {
                    [getScoreColumnForPeriod(data.period)]: 'desc',
                }
            }).withCursor(params),
            data: data,
            pageSize: 10
        })

        return {
            ...response,
            data: TrackMapper.formatMany(_.map(response.data, trackAction => trackAction.track))
        }
    }

    public async mostPopular(data: FetchRankedListRequest) {
        const response = await PaginationHandler.paginate({
            fetchFunction: async (params) => await this.db.trackPopularity.paginate({
                where: {
                    track: {
                        active: true,
                        deleted: false,
                        AND: [
                            await this.formatAdditionalWhereClause(data),
                            {
                                NOT: {
                                    artists: {
                                        some: {
                                            userID: {
                                                in: await this.userBlockService.getBlockedUsers(data)
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    }
                },
                select: {
                    id: true,
                    track: {
                        select: TrackMapper.getSelectableFields(),
                    }
                },
                orderBy: {
                    [getScoreColumnForPeriod(data.period)]: 'desc',
                }
            }).withCursor(params),
            data: data,
            pageSize: 10
        })

        return {
            ...response,
            data: TrackMapper.formatMany(_.map(response.data, trackScore => trackScore.track))
        }
    }

    public async delete(data: TrackIDRequest) {
        await this.db.track.update({
            where: {
                id: data.trackID
            },
            data: {
                deleted: true
            }
        })
    }

    private async formatAdditionalWhereClause(data: FetchRankedListRequest): Promise<Prisma.TrackWhereInput> {
        const conditions: Prisma.TrackWhereInput = {};

        if (data.genreID) {
            conditions.genreID = Number(data.genreID);
        }

        if (data.subgenreID) {
            conditions.subgenreID = Number(data.subgenreID);
        }

        if (data.userID) {
            conditions.artists = {
                some: {
                    userID: Number(data.userID)
                }
            };
        }

        if (data.labelTag) {
            conditions.tags = {
                some: {
                    user: {
                        username: data.labelTag
                    }
                }
            };
        }

        return conditions;
    }
}

TrackService.register()
