import {UserInterface} from "../../user/types";
import {TrackInterface} from "../../track/types";
import {EntityInterface} from "../../../common/types";
import {CommentInterface} from "../../comment/types";
import {MediaInterface} from "../../media/types";

export interface NoteInterface extends EntityInterface {
    id: number
    uuid: string
    created: string
    deleted: string
    looped: boolean
    liked: boolean
    content: string
    likes_count: number
    loops_count: number
    comments_count: number
    user: UserInterface
    track?: TrackInterface
    looper?: UserInterface
    media: Array<MediaInterface>
    comments: Array<CommentInterface>
}