// auth.routes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
    registerSchema,
    loginSchema,
    updateSchema,
} = require("../validations/auth.validation");
const redisRateLimiter = require("../middlewares/redisRateLimiter.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists or validation error
 */
router.post(
    "/register",
    redisRateLimiter,
    validate(registerSchema),
    authController.register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful, returns accessToken and refreshToken
 *       401:
 *         description: Invalid credentials
 */
router.post(
    "/login",
    redisRateLimiter,
    validate(loginSchema),
    authController.login
);

/**
 * @swagger
 * /auth/verify:
 *   get:
 *     summary: Verify JWT token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Unauthorized - invalid or expired token
 */
router.get("/verify", authMiddleware, authController.verifyToken);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user (cached)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns current user data
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authMiddleware, authController.getMe);

/**
 * @swagger
 * /auth/update-profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: newemail@example.com
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put(
    "/update-profile",
    authMiddleware,
    validate(updateSchema),
    authController.updateProfile
);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: New access token returned
 *       401:
 *         description: Refresh token required
 *       403:
 *         description: Invalid refresh token
 */
router.post("/refresh-token", authController.refreshAccessTokenController);

/**
 * @swagger
 * /auth/admin-only:
 *   get:
 *     summary: Admin-only route (RBAC protected)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome Admin
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied - admin role required
 */
router.get(
    "/admin-only",
    authMiddleware,
    authorizeRoles("ADMIN"),
    (req, res) => {
        res.json({ message: "Welcome Admin" });
    }
);

module.exports = router;