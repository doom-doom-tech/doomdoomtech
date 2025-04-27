import {UserInterface} from "@/features/user/types";

export type CommentEntity = 'Note' | 'Track'

export interface CommentTagInterface {
    value: string
    userID: number
}

export interface CommentInterface {
    id: number
    likes: number
    liked: boolean
    created: Date
    deleted: Date | boolean
    content: string
    entity: CommentEntity
    entityID: number
    parentID?: number
    sender: UserInterface
}