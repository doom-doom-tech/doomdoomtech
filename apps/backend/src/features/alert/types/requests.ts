import {$Enums, Prisma} from "@prisma/client";
import {EncodedCursorInterface} from "../../../common/types/pagination";
import {AuthenticatedRequest} from "../../auth/types/requests";

export interface CreateAlertRequest extends Prisma.AlertCreateWithoutTargetInput, AuthenticatedRequest {
    targetID: number
}

export interface FindAlertsRequest extends EncodedCursorInterface, AuthenticatedRequest
{}

export interface DeleteAlertRequest {
    action: $Enums.AlertAction,
    entityType: $Enums.AlertEntityType
    entityID: number
    targetID: number
}

export interface DeleteAlertsWithEntity {
    entityType: $Enums.AlertEntityType
    entityID: number
}