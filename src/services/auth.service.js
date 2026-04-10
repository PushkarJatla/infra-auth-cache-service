// auth.service.js
const bcrypt = require("bcrypt");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const userRepo = require("../repositories/user.repository");

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
    if (!user) {
        throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError("Invalid credentials", 401);
    }

    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return { token };
};

module.exports = {
    register,
    login,
};