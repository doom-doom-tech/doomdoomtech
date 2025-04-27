import Service from "../../../common/services/Service";
import {inject, singleton} from "tsyringe";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {UserInterface} from "../types";
import {UserMapper} from "../mappers/UserMapper";
import PaginationHandler from "../../../common/classes/api/PaginationHandler";
import {EncodedCursorInterface, PaginationResult} from "../../../common/types/pagination";
import {FetchUserVisitorsRequest} from "../types/requests";

export interface IUserVisitService {
    add(userID: number, visitorID: number): Promise<void>
    visitors(data: FetchUserVisitorsRequest): Promise<PaginationResult<UserInterface & { created: Date }>>
}

@singleton()
class UserVisitService extends Service implements IUserVisitService {

    constructor(
        @inject("Database") protected db: ExtendedPrismaClient,
    ) { super() }

    public async add(visitorID: number, userID: number): Promise<void> {
        if (!Number.isInteger(userID) || !Number.isInteger(visitorID)) {
            throw new Error('userID and visitorID must be valid integers');
        }
        await this.db.visit.create({
            data: {
                userID: userID,
                visitorID: visitorID
            }
        });
    }

    public async visitors(data: FetchUserVisitorsRequest): Promise<PaginationResult<UserInterface & { created: Date }>> {

        const visitors = await this.db.visit.findMany({
            select: {
                visitor: {
                    select: UserMapper.getSelectableFields()
                },
                created: true,
                visitorID: true
            },
            where: {
                userID: data.authID,
                NOT: {
                    visitorID: data.authID,
                }
            },
            orderBy: {
                created: 'desc'
            },
            distinct: ['visitorID']
        })

        return {
            prev_page: null,
            next_page: null,
            data: visitors.map(visitor => ({
                ...UserMapper.format(visitor.visitor),
                created: visitor.created
            }))
        }
    }
}

UserVisitService.register()
