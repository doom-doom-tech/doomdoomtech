export interface SocialPlatformInterface {
    type: "Tiktok" | "Website" | "Twitter" | "Snapchat" | "Facebook" | "Instagram" | "Soundcloud" | "Spotify"
    url: string
}

export interface UserSettings {
    events: number
}

export interface UserInterface {
    id: number
    uuid: string
    email: string
    label: boolean
    premium: boolean
    username: string
    verified: boolean
    following: boolean
    avatar_url: string | null
    tracks_count: number
}

export interface SingleUserInterface {
    id: number
    bio: string
    uuid: string
    email: string
    label: boolean
    credits: number
    premium: boolean
    username: string
    verified: boolean
    following: boolean
    invite_code: string
    tracks_count: number
    followers_count: number
    following_count: number
    avatar_url: string | null
    banner_url: string | null
    settings: UserSettings | null
    socials: Array<SocialPlatformInterface>
}