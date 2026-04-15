// auth.routes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { registerSchema, loginSchema, updateSchema } = require("../validations/auth.validation");
const redisRateLimiter = require("../middlewares/redisRateLimiter.middleware");



router.post(
    "/login",
    redisRateLimiter,
    validate(loginSchema),
    authController.login
);

router.post(
    "/register",
    redisRateLimiter,
    validate(registerSchema),
    authController.register
);

router.get("/verify", authMiddleware, authController.verifyToken);

router.get("/me", authMiddleware, authController.getMe);

router.put(
    "/update-profile",
    authMiddleware,
    validate(updateSchema), // optional but recommended
    authController.updateProfile
);

router.post("/refresh-token", authController.refreshAccessTokenController);


module.exports = router;