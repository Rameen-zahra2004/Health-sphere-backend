"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePatientService = exports.updatePatientService = exports.createPatientService = exports.getPatientByIdService = exports.getPatientsService = exports.getMyProfileService = void 0;
const patient_1 = __importDefault(require("../models/patient"));
/* =========================
   NORMALIZER (NO ANY)
========================= */
const normalizePatient = (p) => {
    return {
        _id: p._id.toString(),
        userId: p.userId.toString(),
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email,
        phone: p.phone,
        address: p.address
            ? {
                street: p.address.street ?? null,
                city: p.address.city ?? null,
                state: p.address.state ?? null,
                zipCode: p.address.zipCode ?? null,
            }
            : null,
        emergencyContact: p.emergencyContact
            ? {
                name: p.emergencyContact.name ?? null,
                phone: p.emergencyContact.phone ?? null,
                relation: p.emergencyContact.relation ?? null,
            }
            : null,
        isActive: p.isActive,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
    };
};
/* =========================
   MY PROFILE
========================= */
const getMyProfileService = async (userId) => {
    const patient = await patient_1.default.findOne({ userId }).lean();
    return patient ? normalizePatient(patient) : null;
};
exports.getMyProfileService = getMyProfileService;
/* =========================
   GET ALL PATIENTS
========================= */
const getPatientsService = async () => {
    const patients = await patient_1.default.find({ isActive: true })
        .sort({ createdAt: -1 })
        .lean();
    return patients.map(normalizePatient);
};
exports.getPatientsService = getPatientsService;
/* =========================
   GET PATIENT BY ID
========================= */
const getPatientByIdService = async (id) => {
    const patient = await patient_1.default.findById(id).lean();
    return patient ? normalizePatient(patient) : null;
};
exports.getPatientByIdService = getPatientByIdService;
/* =========================
   CREATE PATIENT
========================= */
const createPatientService = async (data) => {
    const patient = await patient_1.default.create({
        ...data,
        isActive: true,
    });
    return normalizePatient(patient.toObject());
};
exports.createPatientService = createPatientService;
/* =========================
   UPDATE PATIENT
========================= */
const updatePatientService = async (id, data) => {
    const patient = await patient_1.default.findByIdAndUpdate(id, { $set: data }, {
        new: true,
        runValidators: true,
    }).lean();
    return patient ? normalizePatient(patient) : null;
};
exports.updatePatientService = updatePatientService;
/* =========================
   DELETE PATIENT (SOFT DELETE)
========================= */
const deletePatientService = async (id) => {
    const patient = await patient_1.default.findByIdAndUpdate(id, { isActive: false }, { new: true }).lean();
    return patient ? normalizePatient(patient) : null;
};
exports.deletePatientService = deletePatientService;
