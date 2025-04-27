export interface LabelInterface {
    id: number
    tag: string
    uuid: string
    username: string
    premium: boolean
    verified: boolean
    following: boolean
    avatar_url: string | null
    banner_url: string | null
    tracks_count: number
}