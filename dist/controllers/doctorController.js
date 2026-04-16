"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyAppointments = exports.getMyPatients = exports.getDashboard = exports.updateMyProfile = exports.getMyProfile = void 0;
const doctorDashboardService = __importStar(require("../services/doctorService"));
const AppError_1 = require("../utils/AppError");
/* ================= PROFILE ================= */
const getMyProfile = async (req, res, next) => {
    try {
        if (!req.user)
            throw new AppError_1.AppError("Unauthorized", 401);
        const doctor = await doctorDashboardService.getDoctorByUserId(req.user.id);
        res.json({ success: true, data: doctor });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyProfile = getMyProfile;
const updateMyProfile = async (req, res, next) => {
    try {
        if (!req.user)
            throw new AppError_1.AppError("Unauthorized", 401);
        const doctor = await doctorDashboardService.updateDoctorByUserId(req.user.id, req.body);
        res.json({ success: true, data: doctor });
    }
    catch (error) {
        next(error);
    }
};
exports.updateMyProfile = updateMyProfile;
/* ================= DASHBOARD ================= */
const getDashboard = async (req, res, next) => {
    try {
        if (!req.user)
            throw new AppError_1.AppError("Unauthorized", 401);
        const data = await doctorDashboardService.getDoctorDashboard(req.user.id);
        res.json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboard = getDashboard;
/* ================= PATIENTS ================= */
const getMyPatients = async (req, res, next) => {
    try {
        if (!req.user)
            throw new AppError_1.AppError("Unauthorized", 401);
        const patients = await doctorDashboardService.getDoctorPatients(req.user.id);
        res.json({ success: true, data: patients });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyPatients = getMyPatients;
/* ================= APPOINTMENTS ================= */
const getMyAppointments = async (req, res, next) => {
    try {
        if (!req.user)
            throw new AppError_1.AppError("Unauthorized", 401);
        const appointments = await doctorDashboardService.getDoctorAppointments(req.user.id);
        res.json({ success: true, data: appointments });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyAppointments = getMyAppointments;
