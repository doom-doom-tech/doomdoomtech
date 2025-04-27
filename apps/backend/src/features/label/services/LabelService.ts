import Singleton from "../../../common/classes/injectables/Singleton";
import {EncodedCursorInterface, PaginationResult} from "../../../common/types/pagination";
import {inject, singleton} from "tsyringe";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import PaginationHandler from "../../../common/classes/api/PaginationHandler";
import {UserMapper} from "../../user/mappers/UserMapper";
import {FetchRankedListRequest} from "../../../common/services/RankedListService";
import {UserInterface} from "../../user/types";

export interface ILabelService {
    latest(data: FetchRankedListRequest): Promise<PaginationResult<UserInterface>>;
}

@singleton()
class LabelService extends Singleton implements ILabelService {

    constructor(@inject("Database") private db: ExtendedPrismaClient) {
        super();
    }

    public async latest(data: FetchRankedListRequest): Promise<PaginationResult<UserInterface>> {
        const response = await PaginationHandler.paginate<EncodedCursorInterface, any>({
            fetchFunction: async (params) => await this.db.user.paginate({
                orderBy: {created: 'desc'},
                select: UserMapper.getSelectableFields(),
                where: {
                    label: true,
                    username: {
                        not: 'Unauthenticated'
                    }
                },
            }).withCursor(params),
            data: data,
            pageSize: 10
        })

        return {
            ...response,
            data: UserMapper.formatMany(response.data)
        }
    }
}

LabelService.register();