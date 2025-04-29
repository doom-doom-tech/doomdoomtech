import {IServiceInterface, Service} from "../../../common/services/Service";
import {inject, singleton} from "tsyringe";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {ICommentService} from "../../comment/services/CommentService";
import {INoteService} from "../../note/services/NoteService";
import {IAlbumService} from "../../album/services/AlbumService";
import {ITrackService} from "../../track/services/TrackService";
import {container} from "../../../common/utils/tsyringe";
import {Context} from "../../../common/utils/context";
import {FetchPeriodicLikesRequest, MutateLikeRequest} from "../types/requests";
import {INotificationService} from "../../notification/services/NotificationService";
import {UserInterface} from "../../user/types";
import {getDateRangeForPeriod} from "../../../common/utils/utilities";
import {ICreditsService} from "../../credits/services/CreditsService";
import {CREDIT_VALUES} from "../../../common/constants/credits";
import {TRANSACTION_TIMEOUT} from "../../../common/constants";

export interface ILikeService extends IServiceInterface {
	like(data: MutateLikeRequest): Promise<void>;
	unlike(data: MutateLikeRequest): Promise<void>;
	getUniqueLikesForPeriod(data: FetchPeriodicLikesRequest): Promise<number>
}

@singleton()
class LikeService extends Service implements ILikeService {

	constructor(
		@inject('Database') protected db: ExtendedPrismaClient,
	) { super() }

	public like = async (data: MutateLikeRequest) => {
		await this.db.$transaction(async client => {
			const db = client as ExtendedPrismaClient
			await this.create(data, db)
			await this.notifyRecipients(data, db)
			await this.handleMutateEntityCount(data, db, 'increment')
			await this.assignCredits(data, db)
		}, {
			timeout: TRANSACTION_TIMEOUT,
		})
	}

	public unlike = async (data: MutateLikeRequest) => {
		await this.db.$transaction(async client => {
			const db = client as ExtendedPrismaClient
			await this.delete(data, db)
			await this.handleMutateEntityCount(data, db, 'decrement')
		}, {
			timeout: TRANSACTION_TIMEOUT,
		})
	}

	public async assignCredits(data: MutateLikeRequest, db: ExtendedPrismaClient) {
		if(data.entity !== "Track") return

		const creditsService = container
			.resolve<ICreditsService>("CreditsService")
			.bindTransactionClient(db)

		const redisKey = `cg:${Context.get("authID")}:likes`;
		const cachedLikes = await this.redis.lrange(redisKey, 0, -1);

		if (!cachedLikes.includes(`${data.entity}-${data.entityID}`)) {
			await creditsService.add({
				userID: Context.get("authID"),
				amount: CREDIT_VALUES.rate
			})
		}

		await this.redis.rpush(redisKey, String(`${data.entity}-${data.entityID}`));
	}

	public async getUniqueLikesForPeriod(data: FetchPeriodicLikesRequest) {
		const likes =  await this.db.like.aggregate({
			where: {
				trackID: data.trackID,
				created: getDateRangeForPeriod(data.period)
			},
			_sum: {
				amount: true
			}
		})

		return likes._sum.amount ?? 0
	}

	private async handleMutateEntityCount(data: MutateLikeRequest, db: ExtendedPrismaClient, action: 'increment' | 'decrement'): Promise<void> {
		if(data.entity === "Track") return

		const noteService = container.resolve<INoteService>("NoteService").bindTransactionClient(db)
		const albumService = container.resolve<IAlbumService>("AlbumService").bindTransactionClient(db)
		const commentService = container.resolve<ICommentService>("CommentService").bindTransactionClient(db)

		let service: INoteService | IAlbumService | ICommentService | ITrackService

		switch (data.entity) {
			case "Note": service = noteService; break
			case "Album": service = albumService; break
			case "Comment": service = commentService; break
		}

		await service.update({
			where: {
				id: data.entityID,
			},
			data: {
				likes_count: {
					[action]: data.amount
				}
			}
		})
	}

	private async create(data: MutateLikeRequest, db: ExtendedPrismaClient): Promise<void> {
		await db.like.create({
			data: {
				userID: Context.get('authID'),
				[data.entity.toLowerCase() + 'ID']: data.entityID
			}
		})
	}

	private async delete(data: MutateLikeRequest, db: ExtendedPrismaClient): Promise<void> {
		await db.like.deleteMany({
			where: {
				userID: Context.get('authID'),
				[data.entity.toLowerCase() + 'ID']: data.entityID
			}
		})
	}

	private async notifyRecipients(data: MutateLikeRequest, db: ExtendedPrismaClient) {
		const notificationService = container.resolve<INotificationService>("NotificationService").bindTransactionClient(db)
		const recipients = await notificationService.getNotifiableRecipients(data, db)

		for(let recipient of recipients) {
			await notificationService.trigger({
				action: 'Like',
				title: Context.get<UserInterface>('user').username,
				targetID: recipient.id,
				entityType: data.entity,
				entityID: data.entityID,
				userID: Context.get('authID'),
				body: `Liked your ${data.entity.toLowerCase()}`,
				data: { url: `/${data.entity.toLowerCase()}/${data.entityID}` },
			})
		}
	}


}

LikeService.register()