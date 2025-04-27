import {AuthenticatedRequest} from "../../auth/types/requests";


export interface SearchAlbumRequest extends AuthenticatedRequest {
    name: string
}

export interface CreateAlbumRequest extends AuthenticatedRequest {
    uuid: string
    name: string
    release: Date
    cover_url: string
    tracks: Array<number>
}

export interface UpdateAlbumRequest extends AuthenticatedRequest {
    albumID: string
}

