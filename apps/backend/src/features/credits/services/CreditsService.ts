import Service, {IServiceInterface} from "../../../common/services/Service";
import {inject, singleton} from "tsyringe";
import {AddCreditsRequest} from "../types/requests";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";

export interface ICreditsService extends IServiceInterface {
    add(data: AddCreditsRequest): Promise<void>
    create(userID: number): Promise<void>
}

@singleton()
class CreditsService extends Service implements ICreditsService {

    constructor(@inject("Database") protected db: ExtendedPrismaClient) {
        super();
    }

    public async create(userID: number): Promise<void> {
        await this.db.credits.create({
            data: {
                userID,
                amount: 0
            }
        })
    }

    public async add(data: AddCreditsRequest): Promise<void> {
        await this.db.credits.update({
            where: {
                userID: data.userID
            },
            data: {
                amount: {
                    increment: data.amount
                }
            }
        })
    }
}

CreditsService.register()