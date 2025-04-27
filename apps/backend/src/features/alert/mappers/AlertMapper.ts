import {$Enums, Prisma} from "@prisma/client";
import {AlertInterface} from "../types";
import {UserMapper} from "../../user/mappers/UserMapper";
import _ from "lodash";
import {AuthenticatedRequest} from "../../auth/types/requests";
import {TODO} from "../../../common/types";

export type AlertQueryResponse = Prisma.AlertGetPayload<{ select: Prisma.AlertSelect }>

export type FormattedAlert = Omit<AlertInterface, 'entity'> & {
    entityID: number | null,
    entityType: $Enums.AlertEntityType | null
}

class AlertMapper {
    public static getSelectableFields(data: AuthenticatedRequest): Prisma.AlertSelect {
        return {
            id: true,
            read: true,
            created: true,
            count: true,
            content: true,
            action: true,
            entityType: true,
            entityID: true,
            event: {
                select: {
                    event: true,
                    params: true
                }
            },
            users: {
                select: {
                    user: {
                        select: UserMapper.getSelectableFields()
                    }
                }
            },
        }
    }

    public static format(alert: TODO): FormattedAlert {
        return {
            count: alert.count ?? 0,
            read: alert.read ?? false,
            event: alert.event ?? null,
            content: alert.content ?? '',
            action: alert.action ?? 'Info',
            entityID: alert.entityID ?? null,
            created: alert.created ?? new Date(),
            entityType: alert.entityType ?? null,
            users: _.map(alert.users, user => UserMapper.format(user.user)) ?? [],
        }
    }

    public static formatMany(alerts: Array<Prisma.AlertGetPayload<{ select: Prisma.AlertSelect }>>): Array<FormattedAlert> {
        return _.map(alerts, alert => AlertMapper.format(alert))
    }
}

export default AlertMapper