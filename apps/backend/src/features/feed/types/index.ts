export interface AlgoliaFeedItem {
    objectID: string;         // "track-" + uuid or "note-" + uuid
    type: "track" | "note";   // Item type for filtering
    created: number;          // Unix timestamp (seconds) for recency ranking
    userID?: number;          // Author ID for notes
    artistIDs?: number[];     // Artist IDs for tracks
    title?: string;           // Track title (searchable)
    content?: string;         // Note content (searchable)
    genreID?: number;         // Track genre for filtering
    subgenreID?: number;      // Track subgenre for filtering
    trackID?: number;         // Associated track ID for notes
    total_plays?: number;     // Track play count for ranking
    total_likes?: number;     // Track like count for ranking
    likes_count?: number;     // Note like count for ranking
    loops_count?: number;     // Note loop count for ranking
}