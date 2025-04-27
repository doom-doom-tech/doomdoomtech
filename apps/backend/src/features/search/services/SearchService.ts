import {ITrackService} from "../../track/services/TrackService";
import {IUserService} from "../../user/services/UserService";
import {EncodedCursorInterface, PaginationResult} from "../../../common/types/pagination";
import {AuthenticatedRequest} from "../../auth/types/requests";
import {IServiceInterface, Service} from "../../../common/services/Service";
import {inject} from "tsyringe";
import {TrackInterface} from "../../track/types";
import {UserInterface} from "../../user/types";

export interface ISearchService extends IServiceInterface {
	tracks(data: SearchRequestInterface): Promise<PaginationResult<TrackInterface>>
	users(data: SearchRequestInterface): Promise<PaginationResult<UserInterface>>
}

export interface SearchRequestInterface extends EncodedCursorInterface, AuthenticatedRequest {
	genre?: string
	query: string
}

class SearchService extends Service implements ISearchService {

	constructor(
		@inject("TrackService") private readonly trackService: ITrackService,
		@inject("UserService") private readonly userService: IUserService,
	) { super() }

	public async tracks(data: SearchRequestInterface) {
		return this.trackService.search(data);
	}

	public async users(data: SearchRequestInterface) {
		return this.userService.search(data);
	}
}

export default SearchService;