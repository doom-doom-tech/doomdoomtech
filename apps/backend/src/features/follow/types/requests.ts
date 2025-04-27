import {AuthenticatedRequest} from "../../auth/types/requests";
import {UserIDRequest} from "../../user/types/requests";
import {EncodedCursorInterface} from "../../../common/types/pagination";

export interface FollowRequest extends UserIDRequest, AuthenticatedRequest
{}

export interface FollowManyRequest extends AuthenticatedRequest
{
    users: Array<number>
}

export interface FetchUserFollowersRequest extends EncodedCursorInterface, UserIDRequest, AuthenticatedRequest
{}