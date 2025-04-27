import {UserInterface} from "@/features/user/types";

export interface AlbumInterface {
    id: number
    type: 'Album'
    uuid: string
    name: string
    created: Date,
    deleted: boolean,
    user: UserInterface
    tracks_count: number
    cover_url: string | null
}

export interface CreateAlbumRequest {
    ep: boolean
    uuid: string
    name: string
    release: Date
    cover_url: string
    tracks: Array<number>
}