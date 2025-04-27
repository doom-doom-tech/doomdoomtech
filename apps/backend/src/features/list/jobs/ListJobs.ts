import {singleton} from "tsyringe";
import {container} from "../../../common/utils/tsyringe";
import {IListTrackService} from "../services/ListTrackService";
import {AddListTrackRequest} from "../types/requests";

export interface IListJobs {
	executeFakeList(data: AddListTrackRequest): Promise<void>
}

@singleton()
class ListJobs implements IListJobs {
	public executeFakeList = async (data: AddListTrackRequest) => {
		const listTrackService = container.resolve<IListTrackService>("ListTrackService")
		await listTrackService.add(data)
	}
}

export default ListJobs