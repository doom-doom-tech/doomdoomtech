import Singleton from "../../../common/classes/injectables/Singleton";
import {EncodedCursorInterface, PaginationResult} from "../../../common/types/pagination";
import {inject, singleton} from "tsyringe";
import prisma, {ExtendedPrismaClient} from "../../../common/utils/prisma";
import PaginationHandler from "../../../common/classes/api/PaginationHandler";
import {AuthenticatedRequest} from "../../auth/types/requests";
import {NoteInterface} from "../../note/types";
import {AlbumInterface} from "../../album/types";
import {TrackInterface} from "../../track/types";
import NoteMapper from "../../note/mappers/NoteMapper";
import {TrackMapper} from "../../track/mappers/TrackMapper";
import AlbumMapper from "../../album/mappers/AlbumMapper";
import {FeedItemMapper} from "../mappers/FeedMapper";
import CommentMapper from "../../comment/mappers/CommentMapper";
import _ from "lodash";
import {TODO} from "../../../common/types";
import {UserMapper} from "../../user/mappers/UserMapper";
import {algoliasearch} from "algoliasearch";
import {FetchPersonalizedTracks} from "../types/requests";
import {AlgoliaFeedItem} from "../types";
import Redis from "ioredis";

export interface FetchFeedRequest extends AuthenticatedRequest, EncodedCursorInterface {
    excluded: Array<string>
}

export type FeedItemType = NoteInterface | AlbumInterface | TrackInterface;

export interface IFeedService {
    removeViewedHistory(): Promise<void>
    personalized(data: FetchPersonalizedTracks): Promise<PaginationResult<FeedItemType>>;
    recommended(data: AuthenticatedRequest): Promise<Array<FeedItemType>>;
    following(data: FetchFeedRequest): Promise<PaginationResult<FeedItemType>>;
    random(data: FetchFeedRequest): Promise<PaginationResult<FeedItemType>>;
}

const client = algoliasearch(process.env.ALGOLIA_APP_ID as string, process.env.ALGOLIA_API_KEY as string);
const recommendClient = client.initRecommend();

@singleton()
class FeedService extends Singleton implements IFeedService {

    constructor(
        @inject("Database") private db: ExtendedPrismaClient,
        @inject("Redis") redis: Redis
    ) { super() }

    public removeViewedHistory = async () => {
        const keys = await this.redis.keys("*:viewed-feed-items");
        for (const key of keys) {
            await this.redis.del(key);
        }
    }

    /**
     * Fetch personalized tracks and notes from Algolia using the Search API
     * @param data AuthenticatedRequest containing the user ID
     * @returns An array of FeedItemType objects (tracks only)
     */
    public async personalized(data: FetchPersonalizedTracks): Promise<PaginationResult<FeedItemType>> {
        const userID = data.authID.toString();

        const viewedItems = await this.redis.smembers(`${userID}:viewed-feed-items`);

        const filterString = viewedItems.length > 0
            ? viewedItems.map(id => `NOT objectID:'${id}'`).join(" AND ")
            : "";

        try {
            // Step 1: Fetch personalized tracks from Algolia Search API
            const searchResults = await client.search<AlgoliaFeedItem>({
                requests: [{
                    indexName: 'feed-items',
                    query: '',
                    hitsPerPage: 10,
                    enablePersonalization: true,
                    page: data.page,
                    userToken: userID,
                    filters: filterString,
                }],
            });

            const result = searchResults.results[0];

            if ('hits' in result) {
                // Step 2: Parse objectIDs into types and IDs
                const trackIDS: number[] = [];
                const noteIDS: number[] = [];

                result.hits.forEach((item: any) => {

                    this.addViewedObject(data.authID, item.objectID)

                    const [type, id] = item.objectID.split('-');

                    switch (type) {
                        case 'track': trackIDS.push(parseInt(id)); break
                        case 'note': noteIDS.push(parseInt(id)); break
                    }
                });

                // Step 3: Fetch full data from the database
                const [tracks, notes] = await Promise.all([
                    trackIDS.length
                        ? this.db.track.findMany({
                            where: { id: { in: trackIDS } },
                            select: TrackMapper.getSelectableFields(), // Adjust based on your mapper
                        })
                        : [],
                    noteIDS.length
                        ? this.db.note.findMany({
                            where: { id: { in: noteIDS } },
                            select: NoteMapper.getSelectableFields(),
                        })
                        : []
                ]);

                // Step 4: Combine and enrich feed items
                const feedItems: FeedItemType[] = [
                    ...tracks.map((track) => FeedItemMapper.format(track, 'Track')),
                    ...notes.map((note) => FeedItemMapper.format(note, 'Note')),
                ];

                return {
                    data: feedItems,
                    prev_page: null,
                    next_page: data.page + 1 < (result.nbPages ?? 0) ? String(data.page + 1) : null
                };
            } else {
                // Handle the SearchForFacetValues.Response case (unlikely in your scenario)
                return {
                    data: [],
                    prev_page: null,
                    next_page: "1"
                };
            }
        } catch (error) {
            console.error('Error fetching personalized tracks:', error);
            throw error; // Re-throw for controller to handle
        }
    }

    public async recommended(data: AuthenticatedRequest) {
        const userID = data.authID.toString(); // Convert authID to string if needed

        // Step 1: Fetch recommendations from Algolia
        const recommendations = await recommendClient.getRecommendations({
            requests: [
                {
                    indexName: 'feed-items', // Your Algolia index name
                    model: 'trending-items', // Start with trending items; switch to 'personalization' later
                    threshold: 0, // Minimum score for recommendations
                    maxRecommendations: 10, // Number of items to fetch
                    queryParameters: {
                        userToken: userID, // Personalize based on the user
                    },
                },
            ],
        });

        const items = recommendations.results[0].hits; // Extract recommended items

        // Step 2: Parse objectIDs into types and IDs
        const trackIDS: number[] = [];
        const noteIDS: number[] = [];

        items.forEach((item: any) => {
            const [type, id] = item.objectID.split('-'); // Assuming objectID format like 'track-123'

            switch (type) {
                case 'track': trackIDS.push(parseInt(id)); break
                case 'note': noteIDS.push(parseInt(id)); break
            }
        });

        // Step 3: Fetch full data from the database
        const [tracks, notes] = await Promise.all([
            trackIDS.length
                ? this.db.track.findMany({
                    where: { id: { in: trackIDS } },
                    select: TrackMapper.getSelectableFields(), // Adjust based on your mapper
                })
                : [],
            noteIDS.length
                ? this.db.note.findMany({
                    where: { id: { in: noteIDS } },
                    select: NoteMapper.getSelectableFields(),
                })
                : []
        ]);

        // Step 4: Combine and enrich feed items
        const feedItems: FeedItemType[] = [
            ...tracks.map((track) => FeedItemMapper.format(track, 'Track')),
            ...notes.map((note) => FeedItemMapper.format(note, 'Note')),
        ];

        return feedItems;
    }

    public async following(data: FetchFeedRequest) {
        const response = await PaginationHandler.paginate<EncodedCursorInterface, any>({
            fetchFunction: async (params) =>
                await this.db.feedItem.paginate({
                    where: {
                        users: {
                            some: {
                                user: {
                                    followers: {
                                        some: {
                                            userID: data.authID
                                        }
                                    }
                                }
                            }
                        }
                    },
                    include: {
                        note: { select: NoteMapper.getSelectableFields() },
                        track: { select: TrackMapper.getSelectableFields() },
                        album: { select: AlbumMapper.getSelectableFields() },
                    }
                }).withCursor(params),
            data: data,
            pageSize: 10
        });

        // fetch some comments for each entity
        for(let [index, entity] of response.data.entries()) {
            _.set(response, `data[${index}].${entity.entityType.toLowerCase()}.comments`, await this.db.comment.findMany({
                select: CommentMapper.getSelectableFields(),
                where: {
                    entity: entity.entity,
                    entityID: entity.entityID
                },
                take: 2
            }))
        }

        // Fetch user activity for each entity
        for(let [index, entity] of response.data.entries()) {
            if(entity.entityType === 'Track') {
                _.set(response, `data[${index}].${entity.entityType.toLowerCase()}.activity`, await this.fetchTrackActivity(data, entity))
            }
        }

        return {
            ...response,
            data: _.map(response.data, entity => FeedItemMapper.format(entity.entityType === "Track" ? entity.track : entity.note, entity.entityType))
        };
    }

    public async random(data: FetchFeedRequest) {
        let response = await PaginationHandler.paginate<EncodedCursorInterface, TODO>({
            fetchFunction: async (params) =>
                await this.db.feedItem.paginate({
                    include: {
                        note: { select: NoteMapper.getSelectableFields() },
                        track: { select: TrackMapper.getSelectableFields() },
                        album: { select: AlbumMapper.getSelectableFields() }
                    },
                    orderBy: {
                        created: 'desc'
                    }
                }).withCursor(params),
            data: data,
            pageSize: 10
        });

        // fetch some comments for each entity
        for(let [index, entity] of response.data.entries()) {
            _.set(response, `data[${index}].${entity.entityType.toLowerCase()}.comments`,
                await this.db.comment.findMany({
                    select: CommentMapper.getSelectableFields(),
                    where: {
                        entity: entity.entity,
                        entityID: entity.entityID
                    },
                    take: 2
                })
            )
        }

        // Fetch user activity for each entity
        for(let [index, entity] of response.data.entries()) {
            if(entity.entityType === 'Track') {
                _.set(response, `data[${index}].${entity.entityType.toLowerCase()}.activity`, await this.fetchTrackActivity(data, entity))
            }
        }

        return {
            ...response,
            data: _.map(response.data, entity => FeedItemMapper.format(entity, entity.entityType))
        };
    }

    private async fetchTrackActivity(data: FetchFeedRequest, track: TODO) {
        const listResponse = await prisma.list.findMany({
            where: {
                tracks: {
                    some: {
                        trackID: Number(track.trackID),
                    }
                },
                user: {
                    followers: {
                        some: {
                            userID: data.authID
                        }
                    }
                }
            },
            select: {
                user: {
                    select: UserMapper.getSelectableFields()
                }
            },
            take: 2
        })

        const likeResponse = await prisma.like.findMany({
            where: {
                trackID: Number(track.trackID),
                user: {
                    following: {
                        some: {
                            followsID: track.track.main_artist
                        }
                    }
                }
            },
            select: {
                user: {
                    select: UserMapper.getSelectableFields()
                }
            },
            take: 2
        })

        return [
            {
                type: "list",
                users: _.map(listResponse, list => UserMapper.format(list.user))
            },
            {
                type: "like",
                users: _.map(likeResponse, like => UserMapper.format(like.user))
            },
        ]
    }

    private addViewedObject = async (userID: number, objectID: string) => {
        if(userID === 0) return
        await this.redis.sadd(`${userID}:viewed-feed-items`, objectID);
    }
}

FeedService.register();