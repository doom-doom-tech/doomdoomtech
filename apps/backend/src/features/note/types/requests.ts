import {EncodedCursorInterface} from "../../../common/types/pagination";
import {AuthenticatedRequest} from "../../auth/types/requests";
import {FetchRankedListRequest} from "../../../common/services/RankedListService";
import {$Enums} from "@prisma/client";

export interface NoteIDRequest {
    noteID: number
}

export interface FindUserNotesRequest extends EncodedCursorInterface, AuthenticatedRequest {
    userID: number
}

export interface LikeNoteRequest extends NoteIDRequest, AuthenticatedRequest
{}

export interface CreateNoteRequest {
    uuid: string
    content: string
    trackID?: number
    attachments: Array<{ url: string, type: $Enums.MediaType }>
}

export interface CreateNoteMediaRequest {
    noteID: number
    mediaID: number
}

export interface FetchNotesRequest extends EncodedCursorInterface, FetchRankedListRequest {}