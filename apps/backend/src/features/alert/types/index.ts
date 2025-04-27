import {$Enums} from "@prisma/client";
import {UserInterface} from "../../user/types";
import {TrackInterface} from "../../track/types";
import {NoteInterface} from "../../note/types";

export interface AlertEventInterface {
    event: string
    params: string
}

export interface AlertInterface {
    created: Date
    read: boolean
    count: number
    content: string | null
    action: $Enums.AlertAction
    users: Array<UserInterface>
    event: AlertEventInterface | null
    entity: UserInterface | TrackInterface | NoteInterface
}