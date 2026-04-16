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
exports.createAdmin = exports.deletePatient = exports.getAllPatients = exports.deleteDoctor = exports.verifyDoctor = exports.createDoctor = exports.getAllDoctors = void 0;
const adminService = __importStar(require("../services/admin.service"));
const AppError_1 = require("../utils/AppError");
/* ===============================
   SAFE PARAM HELPER (LOCAL)
=============================== */
const getParamId = (id, label) => {
    if (!id || Array.isArray(id)) {
        throw new AppError_1.AppError(`${label} required`, 400);
    }
    return id;
};
/* ===============================
   DOCTORS
=============================== */
/**
 * GET ALL DOCTORS
 */
const getAllDoctors = async (_req, res, next) => {
    try {
        const doctors = await adminService.getAllDoctors();
        res.json({
            success: true,
            data: doctors,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllDoctors = getAllDoctors;
/**
 * CREATE DOCTOR ✅ ADDED
 */
const createDoctor = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, specialization, experience, bio, clinicAddress, consultationFee, } = req.body;
        if (!firstName ||
            !lastName ||
            !email ||
            !password ||
            !specialization ||
            experience === undefined) {
            throw new AppError_1.AppError("Missing required fields", 400);
        }
        const doctor = await adminService.createDoctor({
            firstName,
            lastName,
            email,
            password,
            specialization,
            experience,
            bio,
            clinicAddress,
            consultationFee,
        });
        res.status(201).json({
            success: true,
            data: doctor,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createDoctor = createDoctor;
/* VERIFY DOCTOR
*/
const verifyDoctor = async (req, res, next) => {
    try {
        const id = getParamId(req.params.id, "Doctor ID");
        const result = await adminService.verifyDoctor(id);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyDoctor = verifyDoctor;
/**
 * DELETE DOCTOR
 */
const deleteDoctor = async (req, res, next) => {
    try {
        const id = getParamId(req.params.id, "Doctor ID");
        const result = await adminService.deleteDoctor(id);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteDoctor = deleteDoctor;
/* ===============================
   PATIENTS
=============================== */
/**
 * GET ALL PATIENTS
 */
const getAllPatients = async (_req, res, next) => {
    try {
        const patients = await adminService.getAllPatients();
        res.json({
            success: true,
            data: patients,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllPatients = getAllPatients;
/**
 * DELETE PATIENT
 */
const deletePatient = async (req, res, next) => {
    try {
        const id = getParamId(req.params.id, "Patient ID");
        const result = await adminService.deletePatient(id);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deletePatient = deletePatient;
/* ===============================
   ADMIN MANAGEMENT
=============================== */
/**
 * CREATE ADMIN
 */
const createAdmin = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            throw new AppError_1.AppError("All fields are required", 400);
        }
        const admin = await adminService.createAdmin({
            name,
            email,
            password,
        });
        res.status(201).json({
            success: true,
            data: admin,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createAdmin = createAdmin;
