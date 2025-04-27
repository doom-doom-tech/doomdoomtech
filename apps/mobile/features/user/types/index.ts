export interface SocialPlatformInterface {
    type: "Tiktok" | "Website" | "Twitter" | "Snapchat" | "Facebook" | "Instagram" | "Soundcloud" | "Spotify"
    url: string
}

export interface UserInviteCode {
    usages: number
    code: string
}

export interface UserSettings {
    events: number
}

export interface UserInterface {
    id: number
    uuid: string
    label: boolean
    username: string
    premium: boolean
    verified: boolean
    following: boolean
    avatar_url: string | null
    banner_url: string | null
    tracks_count: number
}

export interface SingleUserInterface {
    id: number
    bio: string
    uuid: string
    label: boolean
    credits: number
    premium: boolean
    username: string
    verified: boolean
    following: boolean
    settings: UserSettings
    followers_count: number
    following_count: number
    tracks_count: number
    avatar_url: string | null
    banner_url: string | null
    invite_code: UserInviteCode
    socials: Array<SocialPlatformInterface>
}