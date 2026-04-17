const Redis = require("ioredis");

let redis;

if (process.env.REDIS_URL) {
    // 🌍 Production (Upstash / Cloud)
    redis = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 1,
    });
} else {
    // 💻 Local (Docker / localhost)
    redis = new Redis({
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: process.env.REDIS_PORT || 6379,
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        retryStrategy(times) {
            if (times >= 3) {
                console.warn("⚠️ Redis unavailable — continuing without cache.");
                return null;
            }
            return Math.min(times * 200, 1000);
        },
    });

    redis.connect().catch(() => { });
}

redis.on("connect", () => {
    console.log("✅ Redis connected");
});

redis.on("error", (err) => {
    console.error("❌ Redis error:", err.message);
});

module.exports = redis;