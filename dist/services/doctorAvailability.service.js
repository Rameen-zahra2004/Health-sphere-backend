"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAvailability = exports.updateAvailability = exports.getAvailability = exports.setAvailability = void 0;
const doctor_1 = __importDefault(require("../models/doctor"));
const doctorAvailability_model_1 = __importDefault(require("../models/doctorAvailability.model"));
const AppError_1 = require("../utils/AppError");
/* ================= CREATE AVAILABILITY ================= */
const setAvailability = async (userId, data) => {
    const doctor = await doctor_1.default.findOne({ userId, isDeleted: false });
    if (!doctor)
        throw new AppError_1.AppError("Doctor not found", 404);
    const exists = await doctorAvailability_model_1.default.findOne({
        doctor: doctor._id,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
    });
    if (exists) {
        throw new AppError_1.AppError("Availability already exists", 409);
    }
    return doctorAvailability_model_1.default.create({
        doctor: doctor._id,
        ...data,
    });
};
exports.setAvailability = setAvailability;
/* ================= GET AVAILABILITY ================= */
const getAvailability = async (userId) => {
    const doctor = await doctor_1.default.findOne({ userId, isDeleted: false });
    if (!doctor)
        throw new AppError_1.AppError("Doctor not found", 404);
    return doctorAvailability_model_1.default.find({
        doctor: doctor._id,
    }).sort({ day: 1 });
};
exports.getAvailability = getAvailability;
/* ================= UPDATE AVAILABILITY ================= */
const updateAvailability = async (id, data) => {
    const updated = await doctorAvailability_model_1.default.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated)
        throw new AppError_1.AppError("Availability not found", 404);
    return updated;
};
exports.updateAvailability = updateAvailability;
/* ================= DELETE AVAILABILITY ================= */
const deleteAvailability = async (id) => {
    const deleted = await doctorAvailability_model_1.default.findByIdAndDelete(id);
    if (!deleted)
        throw new AppError_1.AppError("Availability not found", 404);
    return { success: true };
};
exports.deleteAvailability = deleteAvailability;
