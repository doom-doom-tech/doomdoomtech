import {$Enums, Genre} from "@prisma/client";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";
import _ from "lodash";
import {inject, singleton} from "tsyringe";
import Singleton from "../../../common/classes/injectables/Singleton";

export interface FakeEventRequest {
	amount: number;
	delay?: number;
	entityID: number;
	timeSpan: number;
	data?: Record<any, any>
	genre: Array<Genre['name']>;
	entityType: $Enums.AlertEntityType;
	actionType: $Enums.AlertAction;
}

export interface IFactoryService {
	generateFakeEvents(data: FakeEventRequest): Promise<void>
}

@singleton()
class FactoryService extends Singleton implements IFactoryService {

	constructor(
		@inject("Database") private db: ExtendedPrismaClient
	) { super() }

	public async generateFakeEvents(data: FakeEventRequest): Promise<void> {
		const pickedUsers = await this.pickRandomUsersByGenre(data.genre, data.amount);

		const totalTimeSpanMs = data.timeSpan * 60 * 1000;
		const baseDelayMs = (data.delay || 0) * 1000;

		for (const [i, user] of pickedUsers.entries()) {
			const user = pickedUsers[i];
			const randomDelayMs = Math.floor(Math.random() * totalTimeSpanMs);
			const delay = baseDelayMs + randomDelayMs;
		}
	}

	private async pickRandomUsersByGenre(genres: FakeEventRequest['genre'], amount: number) {
		let response

		if(genres.includes('any')) {
			response = await this.db.fakeUser.findMany()
		} else {
			response = await this.db.fakeUser.findMany({
				where: {
					genre: {
						name: {
							in: genres
						}
					}
				},
			});
		}

		return _.sampleSize(response, amount);
	}
}

export default FactoryService;