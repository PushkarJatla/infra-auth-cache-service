const Redis = require("ioredis");

const redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
    lazyConnect: true,           // don't auto-connect on import
    maxRetriesPerRequest: 1,     // fail fast per command
    retryStrategy(times) {
        if (times >= 3) {
            console.warn("⚠️  Redis unavailable — rate limiting disabled, continuing without cache.");
            return null; // stop retrying
        }
        return Math.min(times * 200, 1000); // backoff: 200ms, 400ms, 600ms
    },
});

redis.on("connect", () => {
    console.log("✅ Redis connected");
});

redis.on("error", (err) => {
    // Log only once per unique message to avoid flooding the console
    if (!redis._lastErrMsg || redis._lastErrMsg !== err.message) {
        console.error("❌ Redis error:", err.message);
        redis._lastErrMsg = err.message;
    }
});

// Attempt connection (non-blocking)
redis.connect().catch(() => {});

module.exports = redis;