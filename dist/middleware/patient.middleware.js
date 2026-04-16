"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPatient = void 0;
const AppError_1 = require("../utils/AppError");
/* =====================================================
   🧑 PATIENT ROLE GUARD (PRODUCTION READY)
===================================================== */
const isPatient = (req, res, next) => {
    if (!req.user) {
        return next(new AppError_1.AppError("Unauthorized", 401));
    }
    if (req.user.role !== "patient") {
        return next(new AppError_1.AppError("Access denied: Patients only", 403));
    }
    next();
};
exports.isPatient = isPatient;
