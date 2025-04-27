import {SingleUserResponse} from "./api/response/entities/user";
import {WithRelationFields} from "../../features/user/services/UserService";

declare module 'cors';

declare global {
	namespace Express {
		interface Request {
			user: SingleUserResponse & WithRelationFields
		}
	}
}