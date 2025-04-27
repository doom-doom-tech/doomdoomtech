import Comment from "@/features/comment/classes/Comment"

export type CommentableEntity = 'Track' | 'Note'

export interface FetchEntityComments {
    entity: CommentableEntity
    entityID: number
}

export interface CommentIDRequest {
    commentID: number
}

export interface PostCommentRequest {
    content: string
    entityID: number
    parentID?: number
    entity: CommentableEntity
}

export interface DeleteCommentRequest {
    commentID: number
}

export interface TriggerCommentReplyRequest {
    entityID: number
    comment: Comment
    entity: CommentableEntity
}