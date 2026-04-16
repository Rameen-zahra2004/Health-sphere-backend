"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOwnPatient = void 0;
const AppError_1 = require("../utils/AppError");
const patient_1 = __importDefault(require("../models/patient"));
/* =====================================================
   🔐 PATIENT OWNERSHIP CHECK (PRODUCTION SAAS SAFE)
===================================================== */
const isOwnPatient = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new AppError_1.AppError("Unauthorized", 401));
        }
        const patientId = req.params.id;
        if (!patientId) {
            return next(new AppError_1.AppError("Missing patient id", 400));
        }
        /* ================= ADMIN BYPASS ================= */
        if (req.user.role === "admin") {
            return next();
        }
        /* ================= FETCH PATIENT ================= */
        const patient = await patient_1.default.findById(patientId).select("userId");
        if (!patient) {
            return next(new AppError_1.AppError("Patient not found", 404));
        }
        /* ================= OWNERSHIP CHECK ================= */
        if (patient.userId.toString() !== req.user.id) {
            return next(new AppError_1.AppError("Access denied", 403));
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.isOwnPatient = isOwnPatient;
