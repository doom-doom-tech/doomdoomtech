import {UserIDRequest} from "../../user/types/requests";

export interface AddCreditsRequest extends UserIDRequest {
    amount: number
}