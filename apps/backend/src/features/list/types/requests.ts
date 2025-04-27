import {AuthenticatedRequest} from "../../auth/types/requests";
import {TrackIDRequest} from "../../track/types/requests";
import {EncodedCursorInterface} from "../../../common/types/pagination";
import {UserIDRequest} from "../../user/types/requests";

export interface ListIDRequest {
    listID: number
}

export interface MutateListTrackRequest extends AuthenticatedRequest, ListIDRequest {
    position: number
    trackID: number
}

export interface FetchListTracksRequest extends AuthenticatedRequest, EncodedCursorInterface, UserIDRequest
{}

export interface MutateListTracksRequest extends AuthenticatedRequest, ListIDRequest {
    tracks: Array<MutateListTrackRequest>
}

export interface CreateListRequest extends AuthenticatedRequest {
    userID: number
}

export interface AddListTrackRequest extends TrackIDRequest
{}

export interface DeleteListTrackRequest extends TrackIDRequest
{}

export interface BulkUpdateListTrackRequest {
    tracks: { trackID: number; position: number }[];
}