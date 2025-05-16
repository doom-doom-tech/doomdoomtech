import {NextFunction, Request, Response} from "express";
import {Context} from "../../../common/utils/context";
import UnauthorizedError from "../../../common/classes/errors/UnauthorizedError";
import {formatErrorResponse} from "../../../common/utils/responses";
import {SingleUserInterface} from "../../user/types";

const LimitNoteCount = async (req: Request<unknown, unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
        const USER = Context.get('user') as SingleUserInterface
        const LIMIT = USER.premium ? 10 : 3

        if(USER.settings && USER.settings.daily_notes >= LIMIT) {
            throw new UnauthorizedError()
        }

        next();
    } catch (error) {
        res.status(403).json(formatErrorResponse("You have reached your daily note limit. Please try again tomorrow."));
    }
};

export default LimitNoteCount;