import Singleton from "../../../common/classes/injectables/Singleton";
import {inject, singleton} from "tsyringe";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {AddListTrackRequest, BulkUpdateListTrackRequest, DeleteListTrackRequest} from "../types/requests";
import {ITrackMetricsService} from "../../track/services/TrackMetricsService";
import {container} from "../../../common/utils/tsyringe";
import {ITrackStatisticsService} from "../../track/services/TrackStatisticsService";
import {TODO} from "../../../common/types";
import {Context} from "../../../common/utils/context";
import {User} from "@prisma/client";
import {IListService} from "./ListService";
import EntityNotFoundError from "../../../common/classes/errors/EntityNotFoundError";
import {ICreditsService} from "../../credits/services/CreditsService";
import {CREDIT_VALUES} from "../../../common/constants/credits";

export interface IListTrackService {
    add(data: AddListTrackRequest): Promise<void>
    remove(data: DeleteListTrackRequest): Promise<void>
    bulkUpdatePositions(data: BulkUpdateListTrackRequest): Promise<void>
}

@singleton()
class ListTrackService extends Singleton implements IListTrackService {

    constructor(
        @inject("Database") protected db: ExtendedPrismaClient
    ) { super() }

    public async add(data: AddListTrackRequest): Promise<void> {

        await this.db.$transaction(async (client) => {
            const db = client as ExtendedPrismaClient

            const listService = container
                .resolve<IListService>("ListService")
                .bindTransactionClient(db)

            const creditsService = container
                .resolve<ICreditsService>("CreditsService")
                .bindTransactionClient(db)



            const list = await listService.find({ userID: Context.get('authID') })

            if(!list) throw new EntityNotFoundError('List')

            await db.listTrack.updateMany({
                where: { listID: list.id },
                data: { position: { increment: 1 } },
            });

            await db.listTrack.create({
                data: {
                    trackID: data.trackID,
                    listID: list.id,
                    position: 0,
                }
            });

            const redisKey = `cg:${Context.get("authID")}:list:tracks`;
            const cachedListTracks = await this.redis.lrange(redisKey, 0, -1);

            if (!cachedListTracks.includes(String(data.trackID))) {
                await creditsService.add({
                    userID: Context.get('authID'),
                    amount: CREDIT_VALUES.save,
                });
            }

            await this.redis.rpush(redisKey, String(data.trackID));

            await this.updateTrackPositionStats(data.trackID, db as TODO);
            await this.deleteFromCache(`lists:${list.id}:tracks`)
            await this.deleteFromCache(`users:${Context.get('authID')}`)
        });
    }

    public async remove(data: DeleteListTrackRequest): Promise<void> {
        await this.db.$transaction(async (tx) => {
            const listService = container.resolve<IListService>("ListService")
            const list = await listService.find({ userID: Context.get('authID') })

            if(!list) throw new EntityNotFoundError('List')

            const track = await tx.listTrack.findFirst({
                where: {
                    listID: list.id, trackID: data.trackID
                },
                select: { position: true }
            });

            if (!track) return;

            await tx.listTrack.deleteMany({
                where: { listID: list.id, trackID: data.trackID },
            });

            await tx.listTrack.updateMany({
                where: {
                    listID: list.id,
                    position: { gt: track.position },
                },
                data: { position: { decrement: 1 } },
            });

            await this.deleteFromCache(`lists:${list.id}:tracks`)
        });
    }

    public async bulkUpdatePositions(data: BulkUpdateListTrackRequest): Promise<void> {
        if (!data.tracks.length) return;

        await this.db.$transaction(async (client) => {
            const db = client as ExtendedPrismaClient

            const list = await db.list.findFirst({
                where: {
                    userID: Context.get<User>('user').id
                }
            })

            if(!list) throw new EntityNotFoundError('List')

            for (const { trackID, position } of data.tracks) {
                await db.listTrack.update({
                    where: {
                        listID_trackID: {
                            listID: list.id,
                            trackID
                        }
                    },
                    data: { position }
                });
            }

            await this.deleteFromCache(`lists:${list.id}:tracks`);
        });
    }

    private async updateTrackPositionStats(trackID: number, db: ExtendedPrismaClient) {
        const trackStatisticsService = container
            .resolve<ITrackStatisticsService>("TrackStatisticsService")
            .bindTransactionClient(db);

        const trackMetricsService = container
            .resolve<ITrackMetricsService>("TrackMetricsService")
            .bindTransactionClient(db);

        const currentDate = new Date();

        // Get average position for this track
        const result = await db.listTrack.aggregate({
            where: { trackID },
            _avg: { position: true },
            _count: { position: true },
        });

        const newAvgPosition = result._avg.position ?? 0;
        const totalLists = result._count.position;

        await trackStatisticsService.update(trackID, currentDate, {
            average_list_position: newAvgPosition,
            total_lists: totalLists,
        });

        await trackMetricsService.update(trackID, {
            average_list_position: newAvgPosition,
            total_lists: totalLists,
        });
    }
}

ListTrackService.register()