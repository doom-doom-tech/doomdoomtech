import {NextFunction, Request, Response} from "express";
import jwt from 'jsonwebtoken';
import {formatErrorResponse} from "../../../common/utils/responses";
import UnauthorizedError from "../../../common/classes/errors/UnauthorizedError";

/**
 * Middleware to validate if the webhook request comes from a trusted source
 * using the same JWT secret as the application.
 */
export const WebhookAuthorized = async (req: Request<unknown, unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['authorization']
        if (token == null) throw new UnauthorizedError()

        jwt.verify(token, process.env.TOKEN_SECRET as string, async (err: any) => {
            if (err) throw new UnauthorizedError()
            next();
        });
    } catch (error: any) {
        res.status(403).json(formatErrorResponse(error.message || "Webhook access denied."));
    }
}

export default WebhookAuthorized;