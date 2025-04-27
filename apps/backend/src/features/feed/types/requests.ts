import {AuthenticatedRequest} from "../../auth/types/requests";

export interface FetchPersonalizedTracks extends AuthenticatedRequest {
    page: number
    excluded: Array<string>
}