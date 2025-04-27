export interface AlgoliaEventRequest {
    entityID: number
    eventType: string
    eventName: string,
    entityType: "Track" | "Note"
}

export interface PersonalizeRequest {
    genres: Array<number>
    authID: number
}