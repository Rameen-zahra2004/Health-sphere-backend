"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
/**
 * ===============================
 * ROLE-BASED ACCESS CONTROL
 * ===============================
 */
const authorize = (...roles) => (req, res, next) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
        return;
    }
    if (!roles.includes(user.role)) {
        res.status(403).json({
            success: false,
            message: "Access denied: insufficient permissions",
        });
        return;
    }
    next();
};
exports.authorize = authorize;
