import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import PaginationHandler from "../../../common/classes/api/PaginationHandler";
import {EncodedCursorInterface, PaginationResult} from "../../../common/types/pagination";
import _ from "lodash";
import {UserInterface} from "../../user/types";
import Singleton from "../../../common/classes/injectables/Singleton";
import {inject, singleton} from "tsyringe";
import {FetchUserFollowersRequest, FollowRequest} from "../types/requests";
import {IUserBlockService} from "../../user/services/UserBlockService";
import {UserMapper} from "../../user/mappers/UserMapper";
import {IUserService} from "../../user/services/UserService";
import {TODO} from "../../../common/types";
import {INotificationService} from "../../notification/services/NotificationService";
import {IAlertService} from "../../alert/services/AlertService";
import {container} from "../../../common/utils/tsyringe";

export interface IFollowService {
	follow(data: FollowRequest): Promise<void>;
	unfollow(data: FollowRequest): Promise<void>;
	followers(data: FetchUserFollowersRequest): Promise<PaginationResult<UserInterface>>
	followees(data: FetchUserFollowersRequest): Promise<PaginationResult<UserInterface>>
}

@singleton()
class FollowService extends Singleton implements IFollowService {

	constructor(
		@inject("Database") private db: ExtendedPrismaClient,
		@inject("UserService") private userService: IUserService,
		@inject("UserBlockService") private userBlockService: IUserBlockService,
		@inject("NotificationService") private notificationService: INotificationService,
	) { super() }

	public followers = async (data: EncodedCursorInterface & { userID: number, authID: number }) => {
		const cacheKey = `followers:${data.userID}:cursor:${data.cursor || 'start'}`;

		return await this.withCache(cacheKey, async () => {
			const response = await PaginationHandler.paginate<EncodedCursorInterface, any>({
				fetchFunction: async (params) => this.db.follow.paginate({
					select: {
						id: true,
						user: {
							select: UserMapper.getSelectableFields(),
						}
					},
					where: {
						followsID: data.userID,
						NOT: { id: { in: await this.userBlockService.getBlockedUsers(data) } }
					},
				}).withCursor(params),
				data: data,
				pageSize: 10,
			});

			return {
				...response,
				data: UserMapper.formatMany(_.map(response.data, follower => follower.user))
			};
		});
	}

	public followees = async (data: EncodedCursorInterface & { userID: number, authID: number }) => {
		const cacheKey = `users:${data.userID}:followees:cursor:${data.cursor || 'start'}`;

		return await this.withCache(cacheKey, async () => {
			const response = await PaginationHandler.paginate<EncodedCursorInterface, any>({
				fetchFunction: async (params) => this.db.follow.paginate({
					select: {
						id: true,
						follows: {
							select: UserMapper.getSelectableFields()
						}
					},
					where: {
						userID: data.userID,
						NOT: { id: { in: await this.userBlockService.getBlockedUsers(data) } }
					},
				}).withCursor(params),
				data: data,
				pageSize: 10,
			});

			return {
				...response,
				data: UserMapper.formatMany(_.map(response.data, follower => follower.follows))
			};
		});
	}

	public follow = async (data: FollowRequest) => {
		try {
			await this.db.$transaction(async (client: TODO) => {
				const prisma = client as ExtendedPrismaClient

				const userService = this.userService.bindTransactionClient(prisma);
				const notificationService = this.notificationService.bindTransactionClient(prisma);

				await this.upsertFollowRecord(prisma, data)
				await this.mutateFollowersCount(prisma, data.userID, 'increment')
				await this.mutateFolloweesCount(prisma, data.authID, 'increment')

				const sender = await userService.find({ userID: data.authID, authID: data.authID })
				const entity = await userService.find({ userID: data.userID, authID: data.authID })

				if(entity && sender) {
					await notificationService.trigger({
						action: 'Follow',
						entityID: data.authID,
						entityType: 'User',
						userID: data.authID,
						targetID: data.userID,
						title: sender.username,
						body: `started following you`,
						data: {
							"url" : `/user/${data.userID}`
						}
					})
				}
			})

			await this.deleteFromCache(`followers:${data.userID}:*`)
			await this.deleteFromCache(`followees:${data.userID}:*`)
			await this.deleteFromCache(`users:${data.userID}`)
			await this.deleteFromCache(`users:${data.authID}`)
		} catch (error) {
			throw error;
		}
	}

	public unfollow = async (data: FollowRequest) => {
		try {
			await this.db.$transaction(async (client: TODO) => {
				const prisma = client as ExtendedPrismaClient

				const alertService = container.resolve<IAlertService>("AlertService").bindTransactionClient(prisma);

				await this.mutateFolloweesCount(prisma, data.authID, 'decrement')
				await this.mutateFolloweesCount(prisma, data.userID, 'decrement')
				await this.deleteFollowRecord(prisma, data)

				await alertService.delete({
					action: 'Follow',
					entityType: 'User',
					entityID: data.authID,
					targetID: data.userID
				})

			})

			await this.deleteFromCache(`followers:${data.userID}:*`)
			await this.deleteFromCache(`followees:${data.userID}:*`)
			await this.deleteFromCache(`users:${data.userID}`)
			await this.deleteFromCache(`users:${data.authID}`)
		} catch (error: any) {
			console.log(error)
			throw error
		}
	}

	private async upsertFollowRecord (prisma: ExtendedPrismaClient, data: FollowRequest) {
		await prisma.follow.upsert({
			where: {
				userID_followsID: {
					userID: data.authID,
					followsID: data.userID,
				},
			},
			update: {},
			create: {
				userID: data.authID,
				followsID: data.userID,
			},
		})
	}

	private async mutateFollowersCount(prisma: ExtendedPrismaClient, userID: number, action: 'increment' | 'decrement') {
		await prisma.user.updateMany({
			where: {
				id: userID
			},
			data: {
				followers_count: {
					[action]: 1
				}
			}
		})
	}

	private async mutateFolloweesCount(prisma: ExtendedPrismaClient, userID: number, action: 'increment' | 'decrement') {
		await prisma.user.updateMany({
			where: {
				id: userID
			},
			data: {
				followers_count: {
					[action]: 1
				}
			}
		})
	}

	private async deleteFollowRecord(prisma: ExtendedPrismaClient, data: FollowRequest) {
		await prisma.follow.deleteMany({
			where: {
				userID: data.authID,
				followsID: data.userID
			}
		})
	}
}

FollowService.register()