import {IFollowService} from "../services/FollowService";
import {inject, injectable} from "tsyringe";
import Instance from "../../../common/classes/injectables/Instance";
import {FakeFollowEventRequest} from "../../factory/types/requests";

export interface IFollowJobs {
	fakeFollowEvent(data: FakeFollowEventRequest): Promise<void>
}

@injectable()
class FollowJobs extends Instance implements IFollowJobs {

	constructor(
		@inject("FollowService") private followService: IFollowService
	) { super() }

	public async fakeFollowEvent(data: FakeFollowEventRequest) {
		try {
			await this.followService.follow({
				userID: data.followsID,
				authID: data.userID
			});
		} catch (error) {
			throw error;
		}
	};
}

export default FollowJobs