const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const userRepo = require("../repositories/user.repository");
const {
    generateAccessToken,
    generateRefreshToken,
} = require("../utils/generateTokens");

const register = async ({ email, password }) => {
    const existingUser = await userRepo.findUserByEmail(email);
    if (existingUser) {
        throw new AppError("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepo.createUser({
        email,
        password: hashedPassword,
    });

    return {
        id: user.id,
        email: user.email,
    };
};
const login = async ({ email, password }) => {
    const user = await userRepo.findUserByEmail(email);
    console.log("User from DB:", user);
    if (!user) {
        throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError("Invalid credentials", 401);
    }

    const accessToken = generateAccessToken(user); // 🔥 updated
    const refreshToken = generateRefreshToken(user.id);

    return {
        accessToken,
        refreshToken,
    };
};


const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new AppError("Refresh token required", 401);
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        // Fetch user from DB to get current role for the new access token
        const user = await userRepo.findUserById(decoded.userId);
        if (!user) {
            throw new AppError("User not found", 401);
        }

        const newAccessToken = generateAccessToken(user);

        return {
            accessToken: newAccessToken,
        };
    } catch (err) {
        if (err instanceof AppError) throw err;
        throw new AppError("Invalid refresh token", 403);
    }
};

module.exports = {
    register,
    login,
    refreshAccessToken,
};