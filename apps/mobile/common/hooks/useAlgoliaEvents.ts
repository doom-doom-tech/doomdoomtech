import searchInsightsClient from 'search-insights';
import api from "@/common/services/api";

searchInsightsClient("init", {
    appId: "RMAD9PJCQN",
    apiKey: "6a0d6396826712472e2fd367c2724c43",
});

export interface AlgoliaEventRequest {
    entityID: number
    eventName: string,
    entityType: "Track" | "Note"
    eventType: "click" | "conversion" | "view"
}

export const sendEvent = async (data: AlgoliaEventRequest) => await api.post('/event', {
    entityID: data.entityID,
    eventName: data.eventName,
    eventType: data.eventType,
    entityType: data.entityType,
})

export const useAlgoliaEvents = () => {
    return {
        playTrack: (trackID: number) => {
            sendEvent({
                entityID: trackID,
                entityType: "Track",
                eventName: "Track Played",
                eventType: "conversion"
            })
        },
        commentOnTrack: (trackID: number) => {
            sendEvent({
                entityID: trackID,
                entityType: "Track",
                eventName: "Track Commented",
                eventType: "click"
            })
        },
        commentOnNote: (noteID: number) => {
            sendEvent({
                entityID: noteID,
                entityType: "Note",
                eventName: "Note Commented",
                eventType: "click"
            })
        },
        likeNote: (noteID: number) => {
            sendEvent({
                entityID: noteID,
                entityType: "Note",
                eventName: "Note Liked",
                eventType: "click"
            })
        },
        likeComment: (entityID: number, entityType: "Track" | "Note") => {
            sendEvent({
                entityID: entityID,
                entityType: entityType,
                eventName: "Comment Liked",
                eventType: "click"
            })
        },
        shareTrack: (trackID: number) => {
            sendEvent({
                entityID: trackID,
                entityType: "Track",
                eventName: "Comment Shared",
                eventType: "conversion"
            })
        },
        rateTrack: (trackID: number, rating: string | number) => {
            sendEvent({
                entityID: trackID,
                entityType: "Track",
                eventName: `Track Rated ${rating} Flames`,
                eventType: "conversion"
            })
        },
        viewItem: (entityID: number, entityType: "Track" | "Note") => {
            sendEvent({
                entityID: entityID,
                entityType: entityType,
                eventName: `${entityType} Viewed`,
                eventType: "view"
            })
        },
        saveToTopPicks: (trackID: number) => {
            sendEvent({
                entityID: trackID,
                entityType: "Track",
                eventName: "Track Saved to Top Picks",
                eventType: "conversion"
            })
        },
    }
};