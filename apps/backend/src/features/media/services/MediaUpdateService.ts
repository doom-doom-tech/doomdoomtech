import Service, {IServiceInterface} from "../../../common/services/Service";
import {inject, singleton} from "tsyringe";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import EntityNotFoundError from "../../../common/classes/errors/EntityNotFoundError";

export interface UpdateSourceRequest {
    uuid: string;
    source: string;
    filename: string;
}

export interface IMediaUpdateService extends IServiceInterface {
    update(data: UpdateSourceRequest): Promise<void>
}

@singleton()
class MediaUpdateService extends Service implements IMediaUpdateService {

    constructor(
        @inject("Database") protected db: ExtendedPrismaClient
    ) { super() }

    public update = async (data: UpdateSourceRequest) => {
        // Find the media
        const media = await this.db.media.findFirst({
            where: {
                url: {
                    contains: `${data.uuid}/${data.filename}`
                }
            }
        });

        if (!media) throw new EntityNotFoundError('Track');

        await this.db.media.update({
            where: {
                id: media.id
            },
            data: {
                url: data.source
            }
        });
    }
}

MediaUpdateService.register()