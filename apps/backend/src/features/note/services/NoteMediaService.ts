import Service, {IServiceInterface} from "../../../common/services/Service";
import {inject, singleton} from "tsyringe";
import {CreateNoteMediaRequest} from "../types/requests";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";

export interface INoteMediaService extends IServiceInterface {
    create(data: CreateNoteMediaRequest): Promise<void>
}

@singleton()
class NoteMediaService extends Service implements INoteMediaService {

    constructor(
        @inject("Database") protected db: ExtendedPrismaClient
    ) { super() }

    public create = async (data: CreateNoteMediaRequest) => {
        await this.db.noteMedia.create({
            data: {
                mediaID: data.mediaID,
                noteID: data.noteID,
            }
        })
    }
}

NoteMediaService.register()
