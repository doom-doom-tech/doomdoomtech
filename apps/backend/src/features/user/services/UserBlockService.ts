import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {inject, singleton} from "tsyringe";
import {UserMapper} from "../mappers/UserMapper";
import _ from "lodash";
import Service from "../../../common/services/Service";
import {UserIDRequest} from "../types/requests";
import {AuthenticatedRequest} from "../../auth/types/requests";
import {UserInterface} from "../types";

export interface IUserBlockService {
    getBlockedUsers(data: AuthenticatedRequest): Promise<Array<number>>
    blockUser(data: UserIDRequest & AuthenticatedRequest): Promise<void>
    unblockUser(data: UserIDRequest & AuthenticatedRequest): Promise<void>
    getFormattedBlockedUsers(data: AuthenticatedRequest): Promise<Array<UserInterface>>
}

@singleton()
class UserBlockService extends Service implements IUserBlockService {

    constructor(
        @inject("Database") protected db: ExtendedPrismaClient,
    ) { super() }

    public blockUser = async (data: UserIDRequest & AuthenticatedRequest) => {
        await this.db.blockedUser.create({
            data: {
                blockerID: data.authID,
                blockedID: data.userID
            }
        })
        await this.deleteFromCache(`users:${data.authID}:blocked-users`)
    }

    public unblockUser = async (data: UserIDRequest & AuthenticatedRequest) => {
        await this.db.blockedUser.deleteMany({
            where: {
                blockerID: data.authID,
                blockedID: data.userID
            }
        })

        await this.deleteFromCache(`users:${data.authID}:blocked-users`)
    }

    public getFormattedBlockedUsers = async (data: AuthenticatedRequest): Promise<Array<UserInterface>> => {
        return this.withCache(
            `users:${data.authID}:blocked-users`,
            async () => UserMapper.formatMany(
                _.map(await this.db.blockedUser.findMany({
                    select: {
                        blocked: {
                            select: UserMapper.getSelectableFields()
                        }
                    },
                    where: {
                        blockerID: data.authID
                    }
                }), (relation) => relation.blocked)
            )
        )
    }

    public getBlockedUsers = async (data: AuthenticatedRequest): Promise<Array<number>> => {
        return _.map(await this.db.blockedUser.findMany({
            select: {
                blocked: {
                    select: {
                        id: true
                    }
                }
            },
            where: {
                blockerID: data.authID
            }
        }), (relation) => relation.blocked.id)
    }
}

UserBlockService.register()