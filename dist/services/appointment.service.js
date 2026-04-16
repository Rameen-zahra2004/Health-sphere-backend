"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAppointmentsAdminService = exports.getAppointmentsByPatientService = exports.createAppointmentService = void 0;
const Appointment_1 = __importDefault(require("../models/Appointment"));
const mongoose_1 = require("mongoose");
/* =========================
   CREATE APPOINTMENT SERVICE
========================= */
const createAppointmentService = async (data) => {
    const { doctorId, date, time } = data;
    if (!doctorId || !date || !time) {
        throw new Error("doctorId, date, and time are required");
    }
    /* =========================
       VALIDATE OBJECT ID
    ========================= */
    if (!mongoose_1.Types.ObjectId.isValid(doctorId)) {
        throw new Error("Invalid doctorId");
    }
    /* =========================
       PREVENT DOUBLE BOOKING
    ========================= */
    const exists = await Appointment_1.default.findOne({
        doctorId,
        date,
        time,
        status: { $ne: "cancelled" },
    });
    if (exists) {
        throw new Error("This time slot is already booked");
    }
    const appointment = await Appointment_1.default.create({
        doctorId,
        date,
        time,
        patientId: data.patientId,
        reason: data.reason,
        status: data.status ?? "pending",
    });
    return appointment;
};
exports.createAppointmentService = createAppointmentService;
/* =========================
   GET PATIENT APPOINTMENTS
========================= */
const getAppointmentsByPatientService = async (patientId) => {
    if (!patientId) {
        throw new Error("patientId is required");
    }
    /* =========================
       VALIDATE OBJECT ID
    ========================= */
    if (!mongoose_1.Types.ObjectId.isValid(patientId)) {
        throw new Error("Invalid patientId");
    }
    const appointments = await Appointment_1.default.find({ patientId })
        .populate("doctorId", "name email")
        .sort({ createdAt: -1 });
    return appointments;
};
exports.getAppointmentsByPatientService = getAppointmentsByPatientService;
/* =========================
   GET ALL APPOINTMENTS (ADMIN)
   - WITH PATIENT + DOCTOR DETAILS
========================= */
const getAllAppointmentsAdminService = async () => {
    const appointments = await Appointment_1.default.find()
        .populate("doctorId", "name email")
        .populate("patientId", "firstName lastName email phone")
        .sort({ createdAt: -1 });
    return appointments;
};
exports.getAllAppointmentsAdminService = getAllAppointmentsAdminService;
