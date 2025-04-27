import {EncodedCursorInterface} from "../../../common/types/pagination";
import {AuthenticatedRequest} from "../../auth/types/requests";

type MessageType = 'Text' | 'Track'

export interface CreateMessageRequestInterface {
    type: MessageType
    content: string
    created: Date
    senderID: number
    entityID?: number
    conversationID: number
}

export interface SendInfoMessageRequest extends AuthenticatedRequest {
    body: string
    title: string
    recipientID: number
}

export interface AuthenticatdConversationRequest extends AuthenticatedRequest {
    conversationID: number
}


export interface AuthenticatedPaginatedConversationRequest extends
    EncodedCursorInterface,
    AuthenticatedRequest,
    AuthenticatdConversationRequest
{}

export interface FindConversationRequest extends AuthenticatedRequest {
    conversationID: number
}

export interface FindManyConversationsRequest extends EncodedCursorInterface, AuthenticatedRequest
{}

export interface FindConversationUsersRequest extends AuthenticatedRequest {
    conversationID: number
}

export interface FindConversationMessagesRequest extends EncodedCursorInterface, AuthenticatedRequest {
    conversationID: number
}

export interface CreateConversationRequest extends AuthenticatedRequest {
    recipientID: number
}