import {UserInterface} from "../../user/types";

type MessageType = 'Text' | 'Track'

export interface MessageInterface {
    created: Date
    updated: Date
    content: string
    senderID: number
    type: MessageType
}

export interface ConversationInterface {
    id: number
    created: Date
    updated: Date
    message: MessageInterface | undefined
    users: Array<UserInterface>
}