"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const isAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No user found",
            });
        }
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied: Admins only",
            });
        }
        next();
    }
    catch {
        return res.status(500).json({
            success: false,
            message: "Server error in admin middleware",
        });
    }
};
exports.isAdmin = isAdmin;
