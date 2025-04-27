import jwt, {Secret} from "jsonwebtoken";
import UnauthorizedError from "../classes/errors/UnauthorizedError";

export type TrackPeriod =  7 | 24 | 30 | 'infinite'

export const extractAuthIDFromBearer = async (bearer: string): Promise<number> => {
	try {
		const decodedAuthID = jwt.verify(bearer, process.env.TOKEN_SECRET as Secret)
		return decodedAuthID ? (Number(decodedAuthID) || 0) : 0
	} catch (error) {
		throw new UnauthorizedError()
	}
}

export const wait = (ms: number): Promise<void> => {
	return new Promise((resolve) => {
		setTimeout(resolve, ms)
	})
}

export const getDateRangeForPeriod = (period: TrackPeriod) => {
	const now = new Date();
	const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

	if (period === 'infinite') {
		return {
			gte: new Date(0),
			lte: today
		};
	}

	const numericPeriod = Number(period);
	let daysAgo: number;

	switch (numericPeriod) {
		case 24: // Treat as 1 day
			daysAgo = 1;
			break;
		case 7:
			daysAgo = 7;
			break;
		case 30:
			daysAgo = 30;
			break;
		default:
			throw new Error(`Invalid period: ${period}`);
	}

	const startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysAgo));

	return {
		gte: startDate,
		lte: today
	};
}

export const getScoreColumnForPeriod = (period: TrackPeriod) => {
	if (period === 'infinite') return 'overall';

	const numericPeriod = typeof period === 'string' ? parseInt(period, 10) : period;

	switch (numericPeriod) {
		case 24:
			return 'day';
		case 7:
			return 'week';
		case 30:
			return 'month';
		default:
			throw new Error(`Invalid period: ${period}`);
	}
}