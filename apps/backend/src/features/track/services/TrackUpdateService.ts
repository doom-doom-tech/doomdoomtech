import {inject, singleton} from "tsyringe";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {TrackMapper} from "../../track/mappers/TrackMapper";
import EntityNotFoundError from "../../../common/classes/errors/EntityNotFoundError";
import Service, {IServiceInterface} from "../../../common/services/Service";
import {TrackInterface} from "../../track/types";

export interface UpdateSourceRequest {
    uuid: string;
    source: string;
}

export interface ITrackUpdateService extends IServiceInterface {
    updateVideoSource(data: UpdateSourceRequest): Promise<void>;
    updateCoverSource(data: UpdateSourceRequest): Promise<void>;
}

@singleton()
class TrackUpdateService extends Service implements ITrackUpdateService {

    constructor(
        @inject("Database") protected db: ExtendedPrismaClient
    ) { super() }

    public async updateVideoSource(data: UpdateSourceRequest): Promise<void> {
        // Find the track
        const track = await this.db.track.findFirst({
            where: {
                deleted: false,
                uuid: data.uuid
            }
        });

        if (!track) throw new EntityNotFoundError('Track');

        // Update the track with the new video URL
        const updatedTrack = await this.db.track.update({
            where: {
                uuid: data.uuid
            },
            data: {
                video_url: data.source
            }
        });

        return
    }

    public async updateCoverSource(data: UpdateSourceRequest): Promise<void> {
        // Find the track
        const track = await this.db.track.findFirst({
            where: {
                deleted: false,
                uuid: data.uuid
            }
        });

        if (!track) throw new EntityNotFoundError('Track');

        // Update the track with the new cover URL
        const updatedTrack = await this.db.track.update({
            where: {
                uuid: data.uuid
            },
            data: {
                cover_url: data.source
            }
        });
    }
}

TrackUpdateService.register();