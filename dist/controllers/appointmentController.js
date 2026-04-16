"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelAppointment = exports.completeAppointmentWithRecord = exports.updateAppointmentStatus = exports.getAllAppointmentsForDoctor = exports.getMyAppointments = exports.createAppointment = void 0;
const mongoose_1 = require("mongoose");
const Appointment_1 = __importDefault(require("../models/Appointment"));
const medicalRecord_1 = __importDefault(require("../models/medicalRecord"));
const appointment_service_1 = require("../services/appointment.service");
/* =========================
   SAFE ID NORMALIZER
========================= */
const normalizeId = (id) => {
    if (!id)
        return null;
    return Array.isArray(id) ? id[0] : id;
};
const getUser = (req) => {
    const user = req.user;
    return user ?? null;
};
/* =========================
   CREATE APPOINTMENT (PATIENT)
========================= */
const createAppointment = async (req, res) => {
    try {
        const user = getUser(req);
        if (!user?.id) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
        const appointment = await (0, appointment_service_1.createAppointmentService)({
            patientId: user.id,
            ...req.body,
        });
        res.status(201).json({
            success: true,
            message: "Appointment created successfully",
            data: appointment,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to create appointment",
        });
    }
};
exports.createAppointment = createAppointment;
/* =========================
   GET MY APPOINTMENTS
========================= */
const getMyAppointments = async (req, res) => {
    try {
        const user = getUser(req);
        if (!user?.id) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
        const appointments = await (0, appointment_service_1.getAppointmentsByPatientService)(user.id);
        res.status(200).json({
            success: true,
            data: appointments,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to fetch appointments",
        });
    }
};
exports.getMyAppointments = getMyAppointments;
/* =========================
   DOCTOR APPOINTMENTS
========================= */
const getAllAppointmentsForDoctor = async (req, res) => {
    try {
        const user = getUser(req);
        if (!user?.id) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
        const appointments = await Appointment_1.default.find({
            doctorId: user.id,
        })
            .populate("patientId", "name email")
            .populate("medicalRecordId")
            .sort({ date: 1, time: 1 });
        res.status(200).json({
            success: true,
            data: appointments,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to fetch appointments",
        });
    }
};
exports.getAllAppointmentsForDoctor = getAllAppointmentsForDoctor;
/* =========================
   UPDATE APPOINTMENT STATUS
========================= */
const updateAppointmentStatus = async (req, res) => {
    try {
        const rawId = normalizeId(req.params.id);
        const { status } = req.body;
        if (!rawId || !mongoose_1.Types.ObjectId.isValid(rawId)) {
            res.status(400).json({
                success: false,
                message: "Invalid appointment ID",
            });
            return;
        }
        const appointment = await Appointment_1.default.findById(rawId);
        if (!appointment) {
            res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
            return;
        }
        appointment.status = status;
        await appointment.save();
        res.status(200).json({
            success: true,
            message: "Status updated successfully",
            data: appointment,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to update status",
        });
    }
};
exports.updateAppointmentStatus = updateAppointmentStatus;
/* =========================
   COMPLETE APPOINTMENT + LINK RECORD
========================= */
const completeAppointmentWithRecord = async (req, res) => {
    try {
        const appointmentId = normalizeId(req.params.id);
        const { medicalRecordId } = req.body;
        if (!appointmentId || !mongoose_1.Types.ObjectId.isValid(appointmentId)) {
            res.status(400).json({
                success: false,
                message: "Invalid appointment ID",
            });
            return;
        }
        const appointment = await Appointment_1.default.findById(appointmentId);
        if (!appointment) {
            res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
            return;
        }
        if (!medicalRecordId) {
            res.status(400).json({
                success: false,
                message: "MedicalRecord ID is required",
            });
            return;
        }
        appointment.status = "completed";
        appointment.medicalRecordId = medicalRecordId;
        await appointment.save();
        await medicalRecord_1.default.findByIdAndUpdate(medicalRecordId, {
            appointmentId: appointment._id,
        });
        res.status(200).json({
            success: true,
            message: "Appointment completed and linked successfully",
            data: appointment,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to complete appointment",
        });
    }
};
exports.completeAppointmentWithRecord = completeAppointmentWithRecord;
/* =========================
   CANCEL APPOINTMENT
========================= */
const cancelAppointment = async (req, res) => {
    try {
        const rawId = normalizeId(req.params.id);
        if (!rawId || !mongoose_1.Types.ObjectId.isValid(rawId)) {
            res.status(400).json({
                success: false,
                message: "Invalid appointment ID",
            });
            return;
        }
        const appointment = await Appointment_1.default.findByIdAndUpdate(rawId, { status: "cancelled" }, { new: true });
        if (!appointment) {
            res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully",
            data: appointment,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to cancel appointment",
        });
    }
};
exports.cancelAppointment = cancelAppointment;
