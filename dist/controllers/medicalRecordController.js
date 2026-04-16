"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecord = exports.updateRecord = exports.getSingleRecord = exports.getAllRecords = exports.getMyRecords = exports.createMedicalRecord = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const medicalRecord_1 = __importDefault(require("../models/medicalRecord"));
const Appointment_1 = __importDefault(require("../models/Appointment"));
/* ================= RESPONSE HELPER ================= */
const sendResponse = (res, status, success, message, data) => {
    return res.status(status).json({ success, message, data });
};
/* ================= SAFE ID HANDLER ================= */
const getSafeId = (id) => {
    if (!id)
        return null;
    return Array.isArray(id) ? id[0] : id;
};
/* ================= CREATE MEDICAL RECORD ================= */
const createMedicalRecord = async (req, res, next) => {
    try {
        const { appointment, disease, symptoms, description, status } = req.body;
        if (!appointment || !disease || !symptoms || !description) {
            return sendResponse(res, 400, false, "All fields are required");
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(appointment)) {
            return sendResponse(res, 400, false, "Invalid appointment ID");
        }
        const appt = await Appointment_1.default.findById(appointment);
        if (!appt) {
            return sendResponse(res, 404, false, "Appointment not found");
        }
        const existingRecord = await medicalRecord_1.default.findOne({ appointment });
        if (existingRecord) {
            return sendResponse(res, 409, false, "Medical record already exists for this appointment");
        }
        const record = await medicalRecord_1.default.create({
            patient: appt.patientId,
            appointment: appt._id,
            doctorAssigned: appt.doctorId,
            disease,
            symptoms,
            description,
            status,
        });
        return sendResponse(res, 201, true, "Medical record created", record);
    }
    catch (error) {
        next(error);
    }
};
exports.createMedicalRecord = createMedicalRecord;
/* ================= GET MY RECORDS ================= */
const getMyRecords = async (req, res, next) => {
    try {
        const user = req.user;
        const records = await medicalRecord_1.default.find({
            patient: user?.id,
        })
            .populate("appointment")
            .populate("doctorAssigned", "firstName lastName email")
            .sort({ createdAt: -1 });
        return sendResponse(res, 200, true, "Records fetched", records);
    }
    catch (error) {
        next(error);
    }
};
exports.getMyRecords = getMyRecords;
/* ================= GET ALL RECORDS ================= */
const getAllRecords = async (_req, res, next) => {
    try {
        const records = await medicalRecord_1.default.find()
            .populate("patient", "firstName lastName email")
            .populate("appointment")
            .populate("doctorAssigned", "firstName lastName email")
            .sort({ createdAt: -1 });
        return sendResponse(res, 200, true, "All records fetched", records);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllRecords = getAllRecords;
/* ================= GET SINGLE RECORD ================= */
const getSingleRecord = async (req, res, next) => {
    try {
        const id = getSafeId(req.params.id);
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return sendResponse(res, 400, false, "Invalid record ID");
        }
        const record = await medicalRecord_1.default.findById(id)
            .populate("patient", "firstName lastName email")
            .populate("appointment")
            .populate("doctorAssigned", "firstName lastName email");
        if (!record) {
            return sendResponse(res, 404, false, "Record not found");
        }
        const user = req.user;
        if (user?.role === "patient" &&
            record.patient.toString() !== user.id) {
            return sendResponse(res, 403, false, "Unauthorized access");
        }
        return sendResponse(res, 200, true, "Record fetched", record);
    }
    catch (error) {
        next(error);
    }
};
exports.getSingleRecord = getSingleRecord;
/* ================= UPDATE RECORD ================= */
const updateRecord = async (req, res, next) => {
    try {
        const id = getSafeId(req.params.id);
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return sendResponse(res, 400, false, "Invalid record ID");
        }
        const record = await medicalRecord_1.default.findById(id);
        if (!record) {
            return sendResponse(res, 404, false, "Record not found");
        }
        const user = req.user;
        if (user?.role === "patient" &&
            record.patient.toString() !== user.id) {
            return sendResponse(res, 403, false, "Unauthorized");
        }
        const updated = await medicalRecord_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        return sendResponse(res, 200, true, "Record updated", updated);
    }
    catch (error) {
        next(error);
    }
};
exports.updateRecord = updateRecord;
/* ================= DELETE RECORD ================= */
const deleteRecord = async (req, res, next) => {
    try {
        const id = getSafeId(req.params.id);
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return sendResponse(res, 400, false, "Invalid record ID");
        }
        const record = await medicalRecord_1.default.findById(id);
        if (!record) {
            return sendResponse(res, 404, false, "Record not found");
        }
        await record.deleteOne();
        return sendResponse(res, 200, true, "Record deleted");
    }
    catch (error) {
        next(error);
    }
};
exports.deleteRecord = deleteRecord;
