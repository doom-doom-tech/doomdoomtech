import {NextFunction, Request, Response} from "express";
import {container} from "tsyringe";
import {Context} from "../../../common/utils/context";
import {ISessionService} from "../services/SessionService";

/**
 * Use this middleware globally (or on routes where you want the session to be refreshed).
 * If a session exists and is near expiration, it will be extended.
 * Note: This middleware does not enforce that a session exists.
 */
export const RefreshSession = async (req: Request, res: Response, next: NextFunction) => {
    const sessionService = container.resolve<ISessionService>("SessionService");

    const authID = Context.get('authID');
    const deviceID = req.headers['x-device-id'] as string;
    const sessionID = req.headers['x-session-id'] as string;

    if (sessionID && authID && deviceID) {
        try {
            const session = await sessionService.validate(sessionID, authID, deviceID);
            if (session) res.setHeader('x-session-id', session.id);
        } catch (err) {
            console.error("Session refresh error:", err);
        }
    }

    next();
};