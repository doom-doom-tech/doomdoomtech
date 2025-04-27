import Service, {IServiceInterface} from "../../../common/services/Service";
import {inject, singleton} from "tsyringe";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {Prisma} from "@prisma/client";
import EntityNotFoundError from "../../../common/classes/errors/EntityNotFoundError";
import {IAlertService} from "../../alert/services/AlertService";
import {MutateCollabRequest} from "../types/requests";
import {Context} from "../../../common/utils/context";

export interface ICollabRequestService extends IServiceInterface {
    create(data: Prisma.CollabRequestCreateArgs['data']): Promise<void>
    accept(data: MutateCollabRequest): Promise<void>
    decline(data: MutateCollabRequest): Promise<void>
}

@singleton()
class CollabRequestService extends Service implements ICollabRequestService {

    constructor(
        @inject("Database") protected db: ExtendedPrismaClient,
        @inject("AlertService") private alertService: IAlertService
    ) { super() }

    public create = async (data: Prisma.CollabRequestCreateArgs['data']) => {
        await this.db.collabRequest.create({
            data
        })
    }

    public accept = async (data: MutateCollabRequest) => {

        const collab = await this.db.collabRequest.findFirst({
            where: {
                targetID: Context.get('authID'),
                trackID: data.trackID
            }
        })

        if(!collab) throw new EntityNotFoundError('Collab')

        await this.db.alert.deleteMany({
            where: {
                entityType: 'Track',
                entityID: data.trackID,
                action: 'Collab',
                targetID: Context.get('authID'),
            }
        })

        await this.db.collabRequest.delete({ where: { id: collab.id, targetID: Context.get('authID') } })

        await this.db.trackArtist.create({
            data: {
                role: collab.role,
                userID: Context.get('authID'),
                trackID: data.trackID,
                royalties: collab.royalties,
            }
        })
    }

    public decline = async (data: MutateCollabRequest) => {
        const collab = await this.db.collabRequest.findFirst({
            where: {
                targetID: Context.get('authID'),
                trackID: data.trackID
            }
        })

        if(!collab) throw new EntityNotFoundError('Collab')

        await this.alertService.delete({
                entityType: 'Track',
                entityID: data.trackID,
                action: 'Collab',
                targetID: Context.get('authID'),
            }
        )

        await this.db.collabRequest.delete({ where: { id: collab.id, targetID: Context.get('authID') } })
    }
}

CollabRequestService.register()