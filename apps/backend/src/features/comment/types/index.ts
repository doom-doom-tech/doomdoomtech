import {UserInterface} from "../../user/types";
import {$Enums} from "@prisma/client";

export interface CommentTagInterface {
    value: string
    userID: number
}

export interface CommentInterface {
    id: number
    likes: number
    liked: boolean
    created: boolean
    deleted: boolean
    content: string
    parentID?: number
    entityID: number
    entity: $Enums.CommentEntityType
    sender: UserInterface
}