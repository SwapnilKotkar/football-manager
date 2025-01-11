// transfer-service/src/middlewares/rateLimiter.ts
import rateLimit from "express-rate-limit";

const transferRateLimiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 60, // limit each IP to 60 requests per windowMs
	message: "Too many requests, please try again later.",
});

export default transferRateLimiter;
