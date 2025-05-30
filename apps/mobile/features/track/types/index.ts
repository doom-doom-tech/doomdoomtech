import {UserInterface} from "@/features/user/types";
import {GenreInterface, SubgenreInterface} from "@/features/genre/types";
import {CommentInterface} from "@/features/comment/types";
import {FilterPeriod} from "@/features/filter/store/filter";
import {UseInfiniteQueryResult, UseQueryResult} from "@tanstack/react-query";

export type MusicScale =
    | "A minor" | "A# minor" | "Ab minor"
    | "B minor" | "Bb minor"
    | "C minor" | "C# minor" | "Db minor"
    | "D minor" | "D# minor" | "Eb minor"
    | "E minor"
    | "F minor" | "F# minor" | "Gb minor"
    | "G minor" | "G# minor";

export interface TrackMetadataInterface {
    bpm: number
    key: number
    era: string
    energy: string
    emotion: string
    mood: Array<string>
    instruments: Array<string>
}

export interface TrackMetricsInterface {
    total_lists: number
    total_likes: number
    total_views: number
    total_plays: number
    total_shares: number
    total_ratings: number
    total_streams: number
    total_comments: number
    total_playtime: number
    average_list_position: number
}

interface BaseTrackInterface {
    id: number
    type: 'Track'
    uuid: string
    title: string
    created: number
    main_artist: number
    waveform_url: string
    audio_url: string | null
    cover_url: string | null
    video_url: string | null
    artists: Array<UserInterface>
    
}

export interface TrackInterface extends BaseTrackInterface {
    bpm: number
    added: boolean
    liked: boolean
    saved: boolean
    caption: string
    key: MusicScale
    genre: GenreInterface
    subgenre: SubgenreInterface
    comments: Array<CommentInterface>
    metadata: TrackMetadataInterface | null
    activity?: Array<TrackActivityInterface>
    metrics: TrackMetricsInterface | undefined
    query: UseQueryResult<any> | UseInfiniteQueryResult<any>
}

export interface TrackActivityInterface {
    type: 'like' | 'list'
    users: Array<UserInterface>
}

export interface AdditionalRankedListParams {
    userID?: number
    labelTag?: string
    genreID?: string | number
    labelID?: number | number
    subgenreID?: string | number
    period: FilterPeriod | string
    distinct?: string
}