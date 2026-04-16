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
exports.RECORD_STATUS = void 0;
const mongoose_1 = __importStar(require("mongoose"));
/* ================= ENUMS ================= */
exports.RECORD_STATUS = {
    PENDING: "pending",
    IN_PROGRESS: "in-progress",
    COMPLETED: "completed",
};
/* ================= SCHEMA ================= */
const MedicalRecordSchema = new mongoose_1.Schema({
    /* ================= PATIENT ================= */
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Patient is required"],
    },
    /* ================= APPOINTMENT ================= */
    appointment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Appointment",
        required: [true, "Appointment is required"],
        unique: true, // ✅ enforce 1 record per appointment
    },
    /* ================= DISEASE ================= */
    disease: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 2,
        maxlength: 100,
    },
    /* ================= SYMPTOMS ================= */
    symptoms: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 500,
    },
    /* ================= DESCRIPTION ================= */
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 1000,
    },
    /* ================= STATUS ================= */
    status: {
        type: String,
        enum: Object.values(exports.RECORD_STATUS),
        default: exports.RECORD_STATUS.PENDING,
    },
    /* ================= DOCTOR ================= */
    doctorAssigned: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
}, {
    timestamps: true,
    versionKey: false,
});
/* ================= INDEXES ================= */
/**
 * Fast patient history
 */
MedicalRecordSchema.index({ patient: 1, createdAt: -1 });
/**
 * Doctor dashboard queries
 */
MedicalRecordSchema.index({ doctorAssigned: 1, status: 1 });
/* ================= MODEL ================= */
const MedicalRecord = mongoose_1.default.models.MedicalRecord ||
    mongoose_1.default.model("MedicalRecord", MedicalRecordSchema);
exports.default = MedicalRecord;
