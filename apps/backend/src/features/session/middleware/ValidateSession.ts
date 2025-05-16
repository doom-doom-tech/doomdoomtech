import {NextFunction, Request, Response} from "express";
import {container} from "tsyringe";
import {Context} from "../../../common/utils/context";
import {ISessionService} from "../services/SessionService";

/**
 * Use this middleware on routes that require a valid session.
 * It validates (or creates) a session and sets the sessionID in both
 * the response header and the Context.
 */
export const ValidateSession = async (req: Request<unknown, unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    const sessionService = container.resolve<ISessionService>("SessionService");

    const [sessionID, deviceID, authID] = [
        req.headers['x-session-id'] as string,
        req.headers['x-device-id'] as string,
        Context.get('authID') as number
    ]

    if(!sessionID || !deviceID) {
        return res.status(401).json({ error: "Session or Device header missing" });
    }

    try {
        const validatedSession = await sessionService.validate(sessionID, authID, deviceID)

        if (!validatedSession) {
            return res.status(440).json({ error: "Unauthorized: Invalid or expired session" });
        }

        // Store session information in the Context for downstream handlers.
        Context.set('sessionID', validatedSession.id);

        next();
    } catch (err) {
        console.error("Session validation error:", err);
        res.status(500).json({ error: "Internal server error." });
    }
};