import {AlgoliaEventRequest, PersonalizeRequest} from "../types/requests";
import {AuthenticatedRequest} from "../../features/auth/types/requests";
import searchInsightsClient from 'search-insights';
import {Context} from "../utils/context";
import prisma from "../utils/prisma";
import {NoteInterface} from "../../features/note/types";
import {TrackInterface} from "../../features/track/types";
import {algoliasearch} from "algoliasearch";
import {TrackMapper} from "../../features/track/mappers/TrackMapper";
import NoteMapper from "../../features/note/mappers/NoteMapper";
import Cachable from "../classes/cache/Cachable";

const client = algoliasearch('RMAD9PJCQN', '16cc8baab62858ef91654fc09f7a6fa6');

searchInsightsClient("init", {
    appId: "RMAD9PJCQN",
    apiKey: "6a0d6396826712472e2fd367c2724c43",
});

export interface IAlgoliaService {
    personalize(data: PersonalizeRequest): Promise<void>
    pushEvent(data: AlgoliaEventRequest & AuthenticatedRequest): Promise<void>
    pushRecord(data: TrackInterface | NoteInterface): Promise<void>
}

class AlgoliaService extends Cachable implements IAlgoliaService {

    constructor() { super() }

    public async personalize(data: PersonalizeRequest): Promise<void> {
        const userID = String(Context.get('authID'));
        const genreIDs = data.genres; // Array of genre IDs
        const allTracks = [];

        // Loop through each genre and fetch up to 5 tracks
        for (const genreID of genreIDs) {
            // Count tracks in this genre
            const tracksCount = await prisma.track.count({ where: { genreID } });

            // Calculate a random skip within the total track count
            const skip = tracksCount > 0 ? Math.floor(Math.random() * tracksCount) : 0;

            // Fetch up to 5 random tracks from this genre
            const tracks = await prisma.track.findMany({
                take: 5,
                skip,
                where: { genreID },
                orderBy: { created: 'desc' },
            });

            // Accumulate into a single array
            allTracks.push(...tracks);
        }

        // Handle case where no tracks are found across all given genres
        if (allTracks.length === 0) {
            console.log('No tracks found in the specified genres');
            return;
        }

        // Prepare track IDs for event generation
        const trackIDs = allTracks.map(track => track.id);

        // Define possible event types and their corresponding event configurations
        const eventTypes = ['view', 'click', 'conversion', 'save', 'rating'] as const;
        const eventConfigs: Record<typeof eventTypes[number], () => { eventName: string; eventType: any }> = {
            view: () => ({
                eventName: 'Track Viewed',
                eventType: 'view',
            }),
            click: () => ({
                eventName: 'Track Clicked',
                eventType: 'click',
            }),
            conversion: () => ({
                eventName: 'Track Played',
                eventType: 'conversion',
            }),
            save: () => ({
                eventName: 'Track Saved to Top Picks',
                eventType: 'conversion',
            }),
            rating: () => {
                const rating = Math.floor(Math.random() * 5) + 1; // Random rating 1..5
                return {
                    eventName: `Track Rated ${rating} Flames`,
                    eventType: 'conversion',
                };
            },
        };

        // Generate 100 random events, picking from our combined track pool
        const events = Array.from({ length: 100 }, () => {
            // Pick a random track ID from the combined list
            const trackID = trackIDs[Math.floor(Math.random() * trackIDs.length)];
            // Pick a random event type
            const eventTypeKey = eventTypes[Math.floor(Math.random() * eventTypes.length)];
            // Build the event object
            const { eventName, eventType } = eventConfigs[eventTypeKey]();
            const objectID = `track-${trackID}`;

            return {
                eventType,              // 'view', 'click', or 'conversion'
                eventName,              // e.g. 'Track Saved to Top Picks'
                index: 'feed-items',    // Index name
                objectIDs: [objectID],  // Single-track events
                userToken: userID,      // Correlate event with user
                authenticatedUserToken: userID,
            };
        });

        // Push all events to Algolia
        await searchInsightsClient('sendEvents', events);

        // Update event count in your DB (by 100 total)
        await prisma.userSettings.update({
            where: { userID: Number(userID) },
            data: { events: { increment: 100 } },
        });

        // Clear any cached user data
        await this.deleteFromCache(`user`);
        await this.deleteFromCache(`users:${userID}`);
    }

    public async pushEvent(data: AlgoliaEventRequest & AuthenticatedRequest): Promise<void> {

        const userID = String(Context.get('authID'))
        const objectID = String(data.entityType.toLowerCase()+ '-' + data.entityID)

        switch (data.eventType) {
            case "click":{
                await searchInsightsClient("clickedObjectIDs", {
                    index: 'feed-items',
                    eventName: data.eventName,
                    objectIDs: [objectID],
                    userToken: userID,
                    authenticatedUserToken: userID,
                })
                break;
            }

            case "conversion": {
                await searchInsightsClient("convertedObjectIDs", {
                    index: 'feed-items',
                    eventName: data.eventName,
                    objectIDs: [objectID],
                    userToken: userID,
                    authenticatedUserToken: userID,
                })
                break;
            }

            case "view":{
                await searchInsightsClient("viewedObjectIDs", {
                    index: 'feed-items',
                    eventName: data.eventName,
                    objectIDs: [objectID],
                    userToken: userID,
                    authenticatedUserToken: userID,
                })
                break;
            }
        }

        // Update user events count
        await prisma.userSettings.update({
            where: { userID: Number(userID) },
            data: {
                events: {
                    increment: 1
                }
            }
        })
    }

    public async pushRecord(data: TrackInterface | NoteInterface) {
        switch (data.type) {
            case "Track": client.saveObjects({
                indexName: 'feed-items',
                objects: [TrackMapper.searchable(data as TrackInterface)]
            }); break

            case "Note": client.saveObjects({
                indexName: 'feed-items',
                objects: [NoteMapper.searchable(data as NoteInterface)]
            }); break
        }
    }
}

export default AlgoliaService