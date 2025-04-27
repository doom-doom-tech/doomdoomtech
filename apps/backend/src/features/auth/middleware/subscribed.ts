import {NextFunction, Request, Response} from "express";
import {Context} from "../../../common/utils/context";
import axios from "axios";
import _ from "lodash";
import {formatErrorResponse} from "../../../common/utils/responses";
import UnauthorizedError from "../../../common/classes/errors/UnauthorizedError";

const Subscribed = async (req: Request<unknown, unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
        const authID = Context.get('authID')

        const projectID = process.env.REVENUECAT_PROJECT_ID as string;
        const apiKEY = process.env.REVENUECAT_API_KEY as string;

        const response = await axios.get(`https://api.revenuecat.com/v2/projects/${projectID}/customers/${authID}`, {
            headers: { Authorization: `Bearer ${apiKEY}` },
        });

        if(_.isEmpty(_.get(response, 'data.active_entitlements.items', []))) {
            throw new UnauthorizedError()
        }

        next();
    } catch (error) {
        res.status(403).json(formatErrorResponse("Premium membership required"));
    }
};

export default Subscribed;