import Service, {IServiceInterface} from "../../../common/services/Service";
import {container, inject, singleton} from "tsyringe";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {$Enums, Comment, Prisma} from "@prisma/client";
import {EncodedCursorInterface, PaginationResult} from "../../../common/types/pagination";
import PaginationHandler from "../../../common/classes/api/PaginationHandler";
import CommentMapper from "../mappers/CommentMapper";
import {CommentInterface} from "../types";
import {INoteService} from "../../note/services/NoteService";
import {INotificationService} from "../../notification/services/NotificationService";
import _ from "lodash";
import {AuthenticatedRequest} from "../../auth/types/requests";
import {ITrackStatisticsService} from "../../track/services/TrackStatisticsService";
import Cachable from "../../../common/classes/cache/Cachable";
import {CommentIDRequest, DeleteCommentRequest} from "../types/requests";
import {ITrackMetricsService} from "../../track/services/TrackMetricsService";
import {Context} from "../../../common/utils/context";
import {CREDIT_VALUES} from "../../../common/constants/credits";
import {ICreditsService} from "../../credits/services/CreditsService";

interface SimpleCommentEntityRequest {
	entity: $Enums.CommentEntityType
	entityID: number
}

export interface FetchRepliesRequest extends
	EncodedCursorInterface,
	AuthenticatedRequest
{
	commentID: number
}

export interface FindSingleCommentRequest extends
	AuthenticatedRequest
{
	commentID: number
}

export interface FetchCommentsRequest extends
	EncodedCursorInterface,
	AuthenticatedRequest
{
	entity: $Enums.CommentEntityType
	entityID: number
}

export type CreateCommentRequest = Prisma.CommentCreateArgs['data'] & AuthenticatedRequest;

export interface ICommentService extends IServiceInterface {
	create(data: CreateCommentRequest): Promise<void>;
	delete(data: DeleteCommentRequest): Promise<void>;
	update(data: Prisma.CommentUpdateArgs): Promise<void>;
	top(data: SimpleCommentEntityRequest): Promise<CommentInterface[]>;
	findSingle(data: FindSingleCommentRequest): Promise<CommentInterface>;
	find(data: FetchCommentsRequest): Promise<PaginationResult<CommentInterface>>;
	findReplies(data: FetchRepliesRequest): Promise<PaginationResult<CommentInterface>>;
}

@singleton()
class CommentService extends Service implements ICommentService {

	constructor(
		@inject("Database") protected db: ExtendedPrismaClient
	) { super() }

	public async top(data: SimpleCommentEntityRequest) {
		return CommentMapper.formatMany(
			await this.db.comment.findMany({
				select: CommentMapper.getSelectableFields(),
				where: {
					entity: data.entity,
					entityID: data.entityID
				},
				orderBy: {
					likes_count: 'desc'
				},
				take: 2
			})
		)
	}

	public async delete(data: DeleteCommentRequest): Promise<void> {
		await this.db.$transaction(async (client) => {
			const db = client as ExtendedPrismaClient;

			await this.db.comment.deleteMany({
				where: {
					id: data.commentID
				}
			});

			switch (data.entity) {
				case "Track":
					await this.updateTrackStatistics(data, db, 'decrement')
					await this.updateTrackMetrics(data, db, 'decrement')
					break;
				case "Note":
					await this.updateNoteActions(data, db, 'decrement');
					break;
			}
		})

		await Cachable.deleteMany([`comments:*`]);
		await Cachable.deleteMany([`replies:*`]);
		await Cachable.deleteMany([`notes:*`]);
	}

	public async find(data: FetchCommentsRequest) {
		const response = await PaginationHandler.paginate<EncodedCursorInterface, Comment>({
			fetchFunction: async (params) =>
				await this.db.comment.paginate({
					where: {
						entity: data.entity,
						entityID: data.entityID,
						parentID: null
					},
					select: CommentMapper.getSelectableFields(),
					orderBy: {
						created: 'desc'
					}
				}).withCursor(params),
			data: data,
			pageSize: 10
		});

		return await this.withCache(
			`comments:${data.entity}:${data.entityID}:${data.cursor || 'start'}`,
			async () => ({
				...response,
				data: CommentMapper.formatMany(response.data)
			})
		);
	}

	public async create(data: CreateCommentRequest) {
		await this.db.$transaction(async (client) => {
			const db = client as ExtendedPrismaClient;

			const creditsService = container.resolve<ICreditsService>("CreditsService");

			await this.post(data, db);
			await this.sendNotifications(data, db);

			switch (data.entity) {
				case "Track":
					await this.updateTrackStatistics(data, db, 'increment')
					await this.updateTrackMetrics(data, db, 'increment')
					break;
				case "Note":
					await this.updateNoteActions(data, db, 'increment');
					break;
			}

			await creditsService.add({
				userID: Context.get("authID"),
				amount: CREDIT_VALUES.comment
			})

			await Cachable.deleteMany([`comments:${data.entity}:${data.entityID}:*`]);
			await Cachable.deleteMany([`replies:*`]);
			await Cachable.deleteMany([`notes:*`]);
		});
	}

	public async update(data: Prisma.CommentUpdateArgs) {
		await this.db.comment.update(data);
	}

	public async findSingle(data: CommentIDRequest) {
		return this.withCache(
			`comments:${data.commentID}`,
			async () => CommentMapper.format(
				await this.db.comment.findFirst({
					select: CommentMapper.getSelectableFields(),
					where: {
						id: data.commentID
					}
				})
			)
		);
	}

	public async findReplies(data: FetchRepliesRequest) {
		const response = await PaginationHandler.paginate<EncodedCursorInterface, Comment>({
			fetchFunction: async (params) =>
				await this.db.comment.paginate({
					where: { parentID: data.commentID },
					orderBy: { created: "asc" },
					select: CommentMapper.getSelectableFields()
				}).withCursor(params),
			data: data,
			pageSize: 3
		});

		return await this.withCache(
			`replies:${data.commentID}:${data.cursor || 'start'}`,
			async () => ({
				...response,
				data: CommentMapper.formatMany(response.data)
			})
		);
	}

	private async updateTrackStatistics(data: { entityID: number }, db: ExtendedPrismaClient, action: 'increment' | 'decrement') {
		const trackStatisticsService = container
			.resolve<ITrackStatisticsService>("TrackStatisticsService")
			.bindTransactionClient(db)

		const currentStatistics = await trackStatisticsService
			.find(data.entityID, new Date());

		await trackStatisticsService.update(data.entityID, new Date(), {
				total_comments: action === 'increment'
					? _.get(currentStatistics, 'total_comments', 0) + 1
					: _.get(currentStatistics, 'total_comments', 0) - 1
			}
		);
	}

	private async updateTrackMetrics(data: { entityID: number }, db: ExtendedPrismaClient, action: 'increment' | 'decrement') {
		const trackMetricsService = container
			.resolve<ITrackMetricsService>("TrackMetricsService")
			.bindTransactionClient(db)

		const currentMetrics = await trackMetricsService
			.find(data.entityID);

		await trackMetricsService.update(data.entityID, {
				total_comments: action === 'increment'
					? _.get(currentMetrics, 'total_comments', 0) + 1
					: _.get(currentMetrics, 'total_comments', 0) - 1
			}
		);
	}

	private async updateNoteActions(data: SimpleCommentEntityRequest, db: ExtendedPrismaClient, action: 'increment' | 'decrement') {
		const noteService = container.resolve<INoteService>("NoteService");
		await noteService.bindTransactionClient(db).update({
			where: { id: data.entityID },
			data: {
				comments_count: {
					[action]: 1
				}
			}
		});
	}

	private async post(data: CreateCommentRequest, db: ExtendedPrismaClient): Promise<Comment> {
		return await db.comment.create({
			data: {
				senderID: data.authID,
				content: data.content,
				entity: data.entity ?? null,
				entityID: data.entityID ?? null,
				parentID: data.parentID ?? null,
			}
		});
	}

	private async sendNotifications(data: CreateCommentRequest, db: ExtendedPrismaClient) {
		const notificationService = container.resolve<INotificationService>("NotificationService");
		const recipients = await notificationService.getNotifiableRecipients(data, db);

		for (const recipient of recipients) {
			if(recipient.id === data.authID) continue;

			await notificationService.bindTransactionClient(db).trigger({
				title: recipient.username,
				userID: data.authID,
				data: { url: `/${_.toLower(data.entity)}/${data.entityID}` },
				action: 'Comment',
				entityType: data.entity,
				entityID: data.entityID,
				targetID: recipient.id,
				body: `Left a comment on your ${data.entity.toLowerCase()}: ${data.content}`,
			});
		}
	}
}

CommentService.register()