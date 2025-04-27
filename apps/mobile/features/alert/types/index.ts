import {UserInterface} from "@/features/user/types";
import {TrackInterface} from "@/features/track/types";
import {CommentInterface} from "@/features/comment/types";
import {NoteInterface} from "@/features/note/types";


export type AlertActionInterface = "Like" | "Play" | "Rate" | "List" | "Share"  | "Follow" | "Collab" | "Upload" | "Comment" | "Info"
export type AlertEntityType = "Track" | "User" | "List" | "Comment" | "Reply" | "Note"

export interface AlertEventInterface {
    event: string
    params: string
}

export interface AlertInterface {
    id: number
    count: number
    content: string
    entityType: AlertEntityType
    action: AlertActionInterface
    users: Array<UserInterface>
    event: AlertEventInterface | null
    entity: TrackInterface | UserInterface | CommentInterface | NoteInterface
}

