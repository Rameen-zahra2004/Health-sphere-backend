"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDoctor = void 0;
/* =========================
   DOCTOR AUTH MIDDLEWARE
========================= */
const isDoctor = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: "Unauthorized: No user found",
        });
        return;
    }
    if (req.user.role !== "doctor") {
        res.status(403).json({
            success: false,
            message: "Access denied: Doctors only",
        });
        return;
    }
    next();
};
exports.isDoctor = isDoctor;
