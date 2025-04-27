import {inject, singleton} from "tsyringe";
import {SendPushNotificationRequest} from "../types/requests";
import {IDeviceService} from "../../device/services/DeviceService";
import {IAlertService} from "../../alert/services/AlertService";
import {IServiceInterface, Service} from "../../../common/services/Service";
import {Context} from "../../../common/utils/context";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {UserInterface} from "../../user/types";
import {container} from "../../../common/utils/tsyringe";
import {INoteService} from "../../note/services/NoteService";
import {ITrackService} from "../../track/services/TrackService";
import {IAlbumService} from "../../album/services/AlbumService";
import {ICommentService} from "../../comment/services/CommentService";
import Expo from "expo-server-sdk";
import {IQueue} from "../../../common/types";

export interface INotificationService extends IServiceInterface {
	/**
	 * Triggers a push notification and creates an alert if the action is not excluded.
	 * @param data - The data required to send a push notification.
	 */
	trigger(data: SendPushNotificationRequest): Promise<void>;

	/**
	 * Sends push notifications to all user devices with push tokens.
	 * @param data - The data required to send a push notification.
	 */
	send(data: SendPushNotificationRequest): Promise<void>;

	/**
	 * Gets all users that are related to the notifyable entity
	 * @param data
	 * @param db
	 * @returns Array<UserInterface>
	 */
	getNotifiableRecipients(data: { entityID: number, entity: string, authID: number }, db: ExtendedPrismaClient): Promise<Array<UserInterface>>
}

@singleton()
class NotificationService extends Service implements INotificationService {

	private excludedFromAlerts: Array<string> = ['Message']

	private expo: Expo;

	public constructor(
		@inject("AlertService") private alertService: IAlertService,
		@inject("DeviceService") private deviceService: IDeviceService,
		@inject("NotificationQueue") private notificationQueue: IQueue,
	) { super(); this.expo = new Expo(); }

	public async trigger(data: SendPushNotificationRequest) {
		try {
			await this.send(data);

			if (!this.excludedFromAlerts.includes(data.action)) {
				await this.alertService.create({
					authID: Context.get('authID'),
					action: data.action,
					entityType: data.entityType,
					entityID: data.entityID,
					targetID: data.targetID,
					content: data.body,
					count: 1,
				});
			}
		} catch (error) {
			console.error('Error in trigger method:', error);
			throw error;
		}
	}

	public async send(data: SendPushNotificationRequest) {
		const userDevices = await this.deviceService.find({ userID: data.targetID });

		const messages = userDevices
			.filter(device => device.push_token && Expo.isExpoPushToken(device.push_token))
			.map(device => ({
				to: device.push_token as string,
				sound: 'default' as const,
				title: data.title,
				body: data.body,
				data: { ...data },
			}));

		if (messages.length === 0) {
			console.log(`No valid push tokens for user ${data.targetID}`);
			return;
		}

		const chunks = this.expo.chunkPushNotifications(messages);
		const maxRetries = 3;

		for (const chunk of chunks) {
			let attempts = 0;
			let success = false;

			while (attempts < maxRetries && !success) {
				try {
					const tickets = await this.expo.sendPushNotificationsAsync(chunk);

					// Check tickets for errors that might need handling
					for (const ticket of tickets) {
						if (ticket.status === 'error') {
							console.error('Push ticket error:', ticket);
							if (ticket.details?.error === 'DeviceNotRegistered') {
								// Handle invalid token - could remove from device service

							}
						}
					}
					success = true;
				} catch (error: any) {
					attempts++;
					console.error(`Attempt ${attempts} failed:`, error);

					if (error.code === 'PUSH_RATE_LIMITED' || error.statusCode === 429) {
						// Exponential backoff for rate limiting
						const delay = Math.pow(2, attempts) * 1000; // 1s, 2s, 4s
						console.log(`Rate limited, retrying after ${delay}ms`);
						await new Promise(resolve => setTimeout(resolve, delay));
					} else if (attempts === maxRetries) {
						console.error('Max retries reached, giving up');
						throw new Error(`Failed to send notification after ${maxRetries} attempts: ${error.message}`);
					} else {
						// Short delay for other errors before retry
						await new Promise(resolve => setTimeout(resolve, 1000));
					}
				}
			}
		}
	}

	public async getNotifiableRecipients(data: { entityID: number, entity: string, authID: number }, db: ExtendedPrismaClient): Promise<Array<UserInterface>> {
		const noteService = container.resolve<INoteService>("NoteService").bindTransactionClient(db)
		const trackService = container.resolve<ITrackService>("TrackService").bindTransactionClient(db)
		const albumService = container.resolve<IAlbumService>("AlbumService").bindTransactionClient(db)
		const commentService = container.resolve<ICommentService>("CommentService").bindTransactionClient(db)

		let recipients: Array<UserInterface> = []

		switch (data.entity) {
			case "Note": {
				const note = await noteService.find({
					noteID: data.entityID, ...data
				})
				recipients = [note.user]
				break;
			}

			case "Album": {
				const album = await albumService.find({
					albumID: data.entityID, ...data
				})
				recipients = [album.user]
				break;
			}

			case "Comment": {
				const comment = await commentService.findSingle({
					commentID: data.entityID, ...data
				})
				recipients = [comment.sender]
				break;
			}

			case "Track": {
				const track = await trackService.find({
					trackID: data.entityID, ...data
				})
				recipients = track.artists
			}
		}

		return recipients as Array<UserInterface>
	}
}

NotificationService.register()