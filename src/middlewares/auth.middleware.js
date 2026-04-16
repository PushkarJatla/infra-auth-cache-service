// auth.middleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check header exists
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Unauthorized: No token provided",
            });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Normalize decoded payload: token uses `userId`, map it to `id`
        req.user = {
            id: decoded.userId,
            role: decoded.role,
        };

        next();
    } catch (err) {
        return res.status(401).json({
            error: "Unauthorized: Invalid or expired token",
        });
    }
};

module.exports = authMiddleware;