const redis = require("../config/redis");

const WINDOW_SIZE = 60; // seconds
const MAX_REQUESTS = 5; // per window

const redisRateLimiter = async (req, res, next) => {
    try {
        const ip = req.ip;
        const key = `rate_limit:${ip}`;

        const requests = await redis.incr(key);

        if (requests === 1) {
            await redis.expire(key, WINDOW_SIZE);
        }

        if (requests > MAX_REQUESTS) {
            return res.status(429).json({
                success: false,
                message: "Too many requests, try again later",
            });
        }

        next();
    } catch (err) {
        console.error("Rate limiter error:", err);
        next(); // fail open (important decision)
    }
};

module.exports = redisRateLimiter;