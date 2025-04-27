import {$Enums} from "@prisma/client";
import {EncodedCursorInterface} from "../../../common/types/pagination";
import {UserIDRequest} from "../../user/types/requests";
import {AuthenticatedRequest} from "../../auth/types/requests";
import {TrackPeriod} from "../../../common/utils/utilities";
import {SearchQueryInterface} from "../../../common/types";

export type TrackArtistRole = 'Artist' | 'Songwriter' | 'Producer'

export interface TrackIDRequest {
    trackID: number
}

export interface CheckTrackArtistRequest extends AuthenticatedRequest {
    trackID: number
}

export interface FindTrackRequest extends AuthenticatedRequest {
    trackID: number
}

export interface ShareTrackRequest extends AuthenticatedRequest {
    trackID: number
    recipientID: number
}

interface CreateTrackRequestArtist {
    userID: number
    royalties: number
    role: $Enums.TrackArtistRole
}

export interface CreateTrackRequest extends AuthenticatedRequest {
    uuid: string
    title: string
    explicit: boolean
    caption: string
    subgenreID: number
    main_artist: number
    tags: Array<number>
    note: string | undefined
    services: Array<string>
    audio_url: string | undefined
    video_url: string | undefined
    cover_url: string | undefined
    external_url?: string
    artists: Array<CreateTrackRequestArtist>
}

export interface FetchUserTracksRequest extends
    UserIDRequest,
    SearchQueryInterface,
    EncodedCursorInterface
{}

export interface SearchTrackRequest extends AuthenticatedRequest, EncodedCursorInterface {
    query: string
}

export interface CreateTrackArtistRequest {
    userID: number
    trackID: number
    royalties: number
    role: TrackArtistRole
}

export interface FindTrackArtistsRequest {
    trackID: number
}

export interface FetchAggregatedTrackStatisticsRequest extends TrackIDRequest {
    period: TrackPeriod
}

export interface CreateTaggedTrackRequest {
    trackID: number
    userID: number
}

export interface LikeTrackRequest {
    amount: number
    trackID: number
}

export interface CreateTrackStreamRequest {
    deviceID: string
    sessionID: string
}

export interface TrackPlaytimeBatchRequest {
    amount: number
}

export interface FetchTracksRequest extends EncodedCursorInterface {
    query: string
}
