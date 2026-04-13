const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");
const redis = require("../config/redis");
const prisma = require("../config/prisma");

const register = asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);

    res.status(201).json({
        message: "User registered successfully",
        user,
    });
});

const login = asyncHandler(async (req, res) => {
    const data = await authService.login(req.body);

    res.status(200).json({
        message: "Login successful",
        ...data,
    });
});

const verifyToken = (req, res) => {
    res.status(200).json({
        message: "Token is valid",
        user: req.user,
    });
};

const getMe = asyncHandler(async (req, res) => {
    const userId = req.user.userId;

    const cacheKey = `user:${userId}`;

    // 🔥 1. Check cache
    const cachedUser = await redis.get(cacheKey);

    if (cachedUser) {
        console.log("⚡ Cache HIT");

        return res.status(200).json({
            source: "cache",
            user: JSON.parse(cachedUser),
        });
    }

    console.log("🐢 Cache MISS");

    // 🔥 2. Fetch from DB
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true },
    });

    // 🔥 Optional: handle edge case
    if (!user) {
        throw new Error("User not found");
    }

    // 🔥 3. Store in cache (TTL: 60 sec)
    await redis.setex(cacheKey, 60, JSON.stringify(user));

    res.status(200).json({
        source: "db",
        user,
    });
});

module.exports = {
    register,
    login,
    verifyToken,
    getMe,
};