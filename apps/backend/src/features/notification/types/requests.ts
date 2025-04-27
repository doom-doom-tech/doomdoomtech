import {$Enums} from "@prisma/client";

export interface SendPushNotificationRequest {
    body: string
    title: string
    userID: number
    entityID: number
    targetID: number
    data: Record<string, any>
    action: $Enums.AlertAction
    entityType: $Enums.AlertEntityType
}
