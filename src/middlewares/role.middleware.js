const AppError = require("../utils/appError");

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role;

        if (!allowedRoles.includes(userRole)) {
            return next(new AppError("Access denied", 403));
        }

        next();
    };
};

module.exports = authorizeRoles;