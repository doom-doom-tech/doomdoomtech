import {UserInterface} from "../../user/types";
import {EntityInterface} from "../../../common/types";

export interface AlbumInterface extends EntityInterface {
    id: number
    uuid: string
    name: string
    created: Date,
    deleted: boolean,
    user: UserInterface,
    cover_url: string | null
    tracks_count: number
}