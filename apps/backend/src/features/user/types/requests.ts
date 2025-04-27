import {SocialPlatformInterface} from "./index";
import {AuthenticatedRequest} from "../../auth/types/requests";
import {Prisma} from "@prisma/client";
import {EncodedCursorInterface} from "../../../common/types/pagination";

export interface UserIDRequest {
    userID: number
}

export interface FindUserRequest extends AuthenticatedRequest {
    userID: number
}

export interface FindUserTracksRequest extends AuthenticatedRequest {
    userID: number
}

export interface FetchLabelsRequest extends AuthenticatedRequest, EncodedCursorInterface
{}

export interface FetchUserVisitorsRequest extends AuthenticatedRequest, EncodedCursorInterface
{}

export interface CreateUserRequest {
    email: string
    username: string
    newsletter: boolean
}

export interface UpdateUserRequest extends
    UserIDRequest,
    AuthenticatedRequest,
    Partial<Prisma.UserUpdateInput>
{}

export interface UpdateUserSocialsRequest extends AuthenticatedRequest {
    socials: Array<SocialPlatformInterface>
}

export interface BlockUserRequest extends AuthenticatedRequest {
    userID: number
}