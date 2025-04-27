import {EncodedCursorInterface} from "../../../common/types/pagination";
import {AuthenticatedRequest} from "../../auth/types/requests";

export interface SearchRequestInterface extends EncodedCursorInterface, AuthenticatedRequest {
    genre?: string
    query: string
}