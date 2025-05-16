import {AlertInterface} from "../types";
import {inject, singleton} from "tsyringe";
import {CreateAlertRequest, DeleteAlertRequest, DeleteAlertsWithEntity, FindAlertsRequest} from "../types/requests";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import {$Enums} from "@prisma/client";
import AlertMapper, {AlertQueryResponse, FormattedAlert} from "../mappers/AlertMapper";
import {EncodedCursorInterface, PaginationResult} from "../../../common/types/pagination";
import PaginationHandler from "../../../common/classes/api/PaginationHandler";
import {AuthenticatedRequest} from "../../auth/types/requests";
import {IServiceInterface, Service} from "../../../common/services/Service";
import _ from "lodash";
import {TrackMapper} from "../../track/mappers/TrackMapper";
import {UserMapper} from "../../user/mappers/UserMapper";
import NoteMapper from "../../note/mappers/NoteMapper";

export interface IAlertService extends IServiceInterface {
	create(data: CreateAlertRequest): Promise<AlertInterface>;
	delete(data: DeleteAlertRequest): Promise<void>;
	count(authID: number): Promise<number>;
	get(data: FindAlertsRequest): Promise<PaginationResult<AlertInterface>>;
	read(data: AuthenticatedRequest): Promise<void>;
	deleteWithEntity(data: DeleteAlertsWithEntity): Promise<void>
}

@singleton()
class AlertService extends Service implements IAlertService {

	constructor(
		@inject("Database") protected db: ExtendedPrismaClient
	) { super() }

	public async create(data: CreateAlertRequest): Promise<AlertInterface> {
		const alert: FormattedAlert = AlertMapper.format(
			await this.db.alert.upsert({
			where: {
				action_entityType_entityID_targetID: {
					action: data.action,
					entityType: data.entityType as $Enums.AlertEntityType,
					entityID: data.entityID as number,
					targetID: data.targetID,
				}
			},
			update: {
				count: { increment: 1 },
				created: new Date(),
				content: data.content,
			},
			create: {
				count: data.count,
				event: data.event,
				action: data.action,
				content: data.content,
				entityID: data.entityID,
				target: { connect: { id: data.targetID } },
				entityType: data.entityType,
				created: new Date(),
				users: {
					create: {
						userID: data.authID
					}
				}
			},
			select: AlertMapper.getSelectableFields(data)
		}))

		return await this.populateEntity(alert, data.authID)
	}

	public async delete(data: DeleteAlertRequest) {
		await this.db.alert.deleteMany({ where: data });
	}

	public async count(authID: number) {
		return await this.db.alert.count({ where: { targetID: authID, read: false } });
	}

	public async get(data: FindAlertsRequest): Promise<PaginationResult<AlertInterface>> {
		const response = await PaginationHandler.paginate<EncodedCursorInterface, AlertQueryResponse>({
			fetchFunction: async (params) => {
				return await this.db.alert.paginate({
					select: AlertMapper.getSelectableFields(data),
					where: { targetID: data.authID },
					orderBy: { created: "desc" },
				}).withCursor(params);
			},
			data: data,
			pageSize: 10,
		});

		// Mark fetched alerts as read
		if (response.data.length > 0) {
			const alertIds = response.data.map(alert => alert.id);
			await this.db.alert.updateMany({
				where: { 
					id: { in: alertIds },
					targetID: data.authID 
				},
				data: { read: true }
			});
		}

		const populatedAlerts = await Promise.all(
			response.data.map(alert => this.populateEntity(AlertMapper.format(alert), data.authID))
		)

		return {
			...response,
			data: populatedAlerts,
		}
	}

	public async read(data: AuthenticatedRequest) {
		await this.db.alert.updateMany({
			where: { targetID: data.authID },
			data: { read: true }
		});
	}

	public async deleteWithEntity(data: DeleteAlertsWithEntity) {
		await this.db.alert.deleteMany({
			where: {
				entityID: data.entityID,
				entityType: data.entityType as $Enums.AlertEntityType,
			}
		})
	}

	private async populateEntity(alert: FormattedAlert, authID: number): Promise<AlertInterface> {
		let clonedAlert: AlertInterface = _.clone(alert) as FormattedAlert & { entity: AlertInterface['entity'] }

		if (alert.entityType && alert.entityID) {
			switch (alert.entityType.toLowerCase()) {
				case 'user': {
					clonedAlert.entity = UserMapper.format(
						await this.db.user.findFirst({
							select: UserMapper.getSelectableFields(),
							where: {
								id: alert.entityID
							}
						})
					);
					break;
				}

				case 'track': {
					clonedAlert.entity = TrackMapper.format(
						await this.db.track.findFirst({
							select: TrackMapper.getSelectableFields(),
							where: {
								id: alert.entityID
							}
						})
					);
					break;
				}

				case 'note': {
					clonedAlert.entity = NoteMapper.format(
						await this.db.note.findFirst({
							select: NoteMapper.getSelectableFields(),
							where: {
								id: alert.entityID
							}
						})
					);
					break;
				}
			}
		}

		return clonedAlert
	}
}

export default AlertService;
