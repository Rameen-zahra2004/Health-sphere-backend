"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyAppointments = exports.deletePatient = exports.updatePatient = exports.createPatient = exports.getPatient = exports.getPatients = exports.getMyProfile = void 0;
const appointment_service_1 = require("../services/appointment.service");
const patient_service_1 = require("../services/patient.service");
const getSafeParam_1 = require("../utils/getSafeParam");
const patient_validation_1 = require("../validators/patient.validation");
/* ================= RESPONSE HELPER ================= */
const send = (res, status, success, message, data) => {
    return res.status(status).json({ success, message, data });
};
/* ================= MY PROFILE ================= */
const getMyProfile = async (req, res, next) => {
    try {
        if (!req.user)
            throw new Error("Unauthorized");
        const patient = await (0, patient_service_1.getMyProfileService)(req.user.id);
        if (!patient) {
            return send(res, 404, false, "Patient not found");
        }
        return send(res, 200, true, "Profile fetched", patient);
    }
    catch (err) {
        next(err);
    }
};
exports.getMyProfile = getMyProfile;
/* ================= ALL PATIENTS ================= */
const getPatients = async (_req, res, next) => {
    try {
        const patients = await (0, patient_service_1.getPatientsService)();
        return send(res, 200, true, "Patients fetched", patients);
    }
    catch (err) {
        next(err);
    }
};
exports.getPatients = getPatients;
/* ================= SINGLE PATIENT ================= */
const getPatient = async (req, res, next) => {
    try {
        const id = (0, getSafeParam_1.getSafeParam)(req.params.id, "id");
        const patient = await (0, patient_service_1.getPatientByIdService)(id);
        if (!patient) {
            return send(res, 404, false, "Patient not found");
        }
        return send(res, 200, true, "Patient fetched", patient);
    }
    catch (err) {
        next(err);
    }
};
exports.getPatient = getPatient;
/* ================= CREATE PATIENT ================= */
const createPatient = async (req, res, next) => {
    try {
        const parsed = patient_validation_1.createPatientSchema.safeParse(req.body);
        if (!parsed.success) {
            return send(res, 400, false, "Validation error", parsed.error.flatten());
        }
        const patient = await (0, patient_service_1.createPatientService)(parsed.data);
        return send(res, 201, true, "Patient created", patient);
    }
    catch (err) {
        next(err);
    }
};
exports.createPatient = createPatient;
/* ================= UPDATE PATIENT ================= */
const updatePatient = async (req, res, next) => {
    try {
        const id = (0, getSafeParam_1.getSafeParam)(req.params.id, "id");
        const parsed = patient_validation_1.updatePatientSchema.safeParse(req.body);
        if (!parsed.success) {
            return send(res, 400, false, "Validation error", parsed.error.flatten());
        }
        const patient = await (0, patient_service_1.updatePatientService)(id, parsed.data);
        if (!patient) {
            return send(res, 404, false, "Patient not found");
        }
        return send(res, 200, true, "Patient updated", patient);
    }
    catch (err) {
        next(err);
    }
};
exports.updatePatient = updatePatient;
/* ================= DELETE PATIENT ================= */
const deletePatient = async (req, res, next) => {
    try {
        const id = (0, getSafeParam_1.getSafeParam)(req.params.id, "id");
        const patient = await (0, patient_service_1.deletePatientService)(id);
        if (!patient) {
            return send(res, 404, false, "Patient not found");
        }
        return send(res, 200, true, "Patient deleted", patient);
    }
    catch (err) {
        next(err);
    }
};
exports.deletePatient = deletePatient;
const getMyAppointments = async (req, res, next) => {
    try {
        if (!req.user)
            throw new Error("Unauthorized");
        const appointments = await (0, appointment_service_1.getAppointmentsByPatientService)(req.user.id);
        res.json({
            success: true,
            message: "My appointments fetched",
            data: appointments,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getMyAppointments = getMyAppointments;
