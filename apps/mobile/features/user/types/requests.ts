import {SocialPlatformInterface} from "@/features/user/types/index";

export interface UserIDRequest {
    userID: number
}

export interface UpdateUserRequest {
    bio: string
    username: string
    socials: Array<SocialPlatformInterface>
}

export interface BlockUserRequest{
    blockedID: number
}