import {UserInterface} from "@/features/user/types";
import {TrackInterface} from "@/features/track/types";
import {CommentInterface} from "@/features/comment/types";
import {MediaInterface} from "@/features/media/types";

export interface NoteAttachmentInterface {
    type: "Video" | "Image" | "file"
    url: string
}

export interface NoteInterface {
    id: number
    uuid: string
    type: 'Note'
    content: string
    looped: boolean
    liked: boolean
    likes_count: number
    loops_count: number
    comments_count: number
    user: UserInterface
    comments: Array<CommentInterface>
    track: TrackInterface | null
    looper: UserInterface | null
    media: Array<MediaInterface>
    created: Date
    deleted: boolean
}