import {AuthenticatedRequest} from "../../auth/types/requests";
import {TrackPeriod} from "../../../common/utils/utilities";

type LikeableEntity = 'Note' | 'Comment' | 'Album' | 'Track'

export interface MutateLikeRequest extends AuthenticatedRequest {
    entity: LikeableEntity
    entityID: number
    amount?: number
}

export interface FetchPeriodicLikesRequest {
    trackID: number
    period: TrackPeriod
}