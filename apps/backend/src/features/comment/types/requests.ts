import {$Enums} from "@prisma/client";
import {EncodedCursorInterface} from "../../../common/types/pagination";

export interface CommentIDRequest {
    commentID: number
}

export interface FindCommentsRequest extends EncodedCursorInterface {
    entity: $Enums.CommentEntityType
    entityID: number
}

export interface DeleteCommentRequest {
    commentID: number
    entity: $Enums.CommentEntityType
    entityID: number
}