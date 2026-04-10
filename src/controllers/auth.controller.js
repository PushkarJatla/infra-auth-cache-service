const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");

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

module.exports = {
    register,
    login,
    verifyToken,
};