export interface TrackIDRequest {
    trackID: number
}

export interface FetchRankedTracksRequest {
    period: 24 | 7 | 30 | 'infinite'
    query?: string
}

interface CreateTrackRequestArtist {
    userID: number
    royalties: number
    role: 'Artist' | 'Producer' | 'Songwriter'
}

export interface CreateTrackRequest {
    explicit: boolean
    caption: string
    title: string
    subgenreID: number
    total_assets: number
    main_artist: number
    tags: Array<number>
    note: string | undefined
    artists: Array<CreateTrackRequestArtist>
}

export interface LikeTrackRequest {
    trackID: number
    amount: number
}