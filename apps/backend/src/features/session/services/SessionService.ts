import {createHash, randomBytes} from 'crypto';
import {singleton} from "tsyringe";
import {sign, verify} from "jsonwebtoken";
import {container} from "../../../common/utils/tsyringe";
import Service from "../../../common/services/Service";
import ValidationError from "../../../common/classes/errors/ValidationError";

export interface SessionPayload {
    id: string;
    expires: Date;
    userID: number;
    deviceID: string;
    fingerprint: string;
}

export interface ISessionService {
    create(userID: number, deviceID: string): Promise<SessionPayload>;
    validate(sessionID: string, userID: number, deviceID: string): Promise<SessionPayload | null>;
}

@singleton()
class SessionService extends Service implements ISessionService {

    private readonly JWT_SECRET = process.env.TOKEN_SECRET || 'your-secret-key';

    private readonly SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
    private readonly EXTENSION_THRESHOLD = 5 * 60 * 1000; // 5 minutes

    static register<T extends new (...args: any[]) => any>(this: T, identifier?: string): void {
        container.register(identifier || this.name, { useClass: this });
    }

    public async create(userID: number, deviceID: string): Promise<SessionPayload> {
        const sessionKey = `user:${userID}:sessions`;

        // Step 1: Remove expired sessions
        await this.redis.zremrangebyscore(sessionKey, '-inf', Date.now());

        // Step 2: Get all non-expired session IDs for the user
        const existingSessionIDs = await this.redis.zrange(sessionKey, 0, -1);

        // Step 3: Check for an existing valid session for this deviceID
        for (const sessionID of existingSessionIDs) {
            const sessionData = await this.redis.hgetall(`session:${sessionID}`);
            if (sessionData && sessionData.deviceID === deviceID) {
                // Attempt to validate the session
                const validatedSession = await this.validate(sessionID, userID, deviceID);
                if (validatedSession) {
                    // If valid, return the existing session
                    return validatedSession;
                }
                // If validation fails, the session is invalidated by validate(), so continue
            }
        }

        // Step 4: No valid session found; check session limit
        if (existingSessionIDs.length >= 5) {
            throw new ValidationError("Log out one of your other devices first");
        }

        // Step 5: Create a new session
        const sessionID = randomBytes(32).toString('hex');
        const session: SessionPayload = {
            id: sessionID,
            userID,
            deviceID,
            fingerprint: this.generateSessionFingerprint(deviceID, userID),
            expires: new Date(Date.now() + this.SESSION_DURATION),
        };

        const internalToken = sign(session, this.JWT_SECRET, { expiresIn: '30m' });

        await this.redis.multi()
            .hmset(`session:${sessionID}`, {
                internalToken,
                userID: userID.toString(),
                deviceID,
                fingerprint: session.fingerprint,
                expires: session.expires.getTime().toString()
            })
            .zadd(sessionKey, session.expires.getTime(), sessionID)
            .expire(`session:${sessionID}`, this.SESSION_DURATION / 1000)
            .exec();

        return session;
    }

    public async validate(sessionID: string, userID: number, deviceID: string): Promise<SessionPayload | null> {
        const sessionKey = `user:${userID}:sessions`;

        // Remove expired sessions before validation
        await this.redis.zremrangebyscore(sessionKey, '-inf', Date.now());

        try {
            const sessionData = await this.redis.hgetall(`session:${sessionID}`);
            if (!sessionData || !Object.keys(sessionData).length) return null;

            const decoded = verify(sessionData.internalToken, this.JWT_SECRET) as SessionPayload;

            if (
                new Date(decoded.expires) < new Date()
                || decoded.userID !== userID
                || decoded.deviceID !== deviceID
                || this.generateSessionFingerprint(deviceID, userID) !== decoded.fingerprint
            ) {
                await this.invalidate(sessionID, userID);
                return null;
            }

            const timeLeft = new Date(decoded.expires).getTime() - Date.now();

            if (timeLeft < this.EXTENSION_THRESHOLD) {
                return await this.extend(decoded);
            }

            return decoded;
        } catch {
            return null;
        }
    }

    public async extend(session: SessionPayload): Promise<SessionPayload> {
        const updatedSession: SessionPayload = {
            ...session,
            expires: new Date(Date.now() + this.SESSION_DURATION)
        };

        const internalToken = sign(updatedSession, this.JWT_SECRET, { expiresIn: '30m' });

        await this.redis.multi()
            .hmset(`session:${session.id}`, {
                internalToken, expires: updatedSession.expires.getTime().toString()
            })
            .zadd(`user:${session.userID}:sessions`, Date.now() + this.SESSION_DURATION, session.id)
            .expire(`session:${session.id}`, this.SESSION_DURATION / 1000)
            .exec();

        return updatedSession;
    }

    private async invalidate(sessionID: string, userID: number) {
        const sessionData = await this.redis.hgetall(`session:${sessionID}`);

        if (sessionData) {
            await this.redis.multi()
                .del(`session:${sessionID}`)
                .zrem(`user:${userID}:sessions`, sessionID)
                .exec();
        }
    }

    private generateSessionFingerprint(deviceID: string, userID: number): string {
        return createHash('sha256').update(`${deviceID}:${userID}`).digest('hex');
    }
}

SessionService.register();