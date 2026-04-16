"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicalRecordService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const medicalRecord_1 = __importDefault(require("../models/medicalRecord"));
/* ================= SERVICE ================= */
exports.medicalRecordService = {
    /* ================= CREATE ================= */
    createRecord: async (data) => {
        const record = await medicalRecord_1.default.create(data);
        return record;
    },
    /* ================= GET MY RECORDS ================= */
    getMyRecords: async (patientId) => {
        return await medicalRecord_1.default.find({ patient: patientId }).sort({
            createdAt: -1,
        });
    },
    /* ================= GET ALL ================= */
    getAllRecords: async () => {
        return await medicalRecord_1.default.find()
            .populate("patient", "firstName lastName email")
            .sort({ createdAt: -1 });
    },
    /* ================= GET BY ID ================= */
    getById: async (id) => {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid medical record ID");
        }
        return await medicalRecord_1.default.findById(id);
    },
    /* ================= UPDATE ================= */
    updateRecord: async (id, data) => {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid medical record ID");
        }
        return await medicalRecord_1.default.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    },
    /* ================= DELETE ================= */
    deleteRecord: async (id) => {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid medical record ID");
        }
        return await medicalRecord_1.default.findByIdAndDelete(id);
    },
};
