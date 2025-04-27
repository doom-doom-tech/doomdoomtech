import rateLimit, {Options} from "express-rate-limit";

const createDynamicRateLimiter = (options: Partial<Options>) => {
	return rateLimit(options);
}

export default createDynamicRateLimiter