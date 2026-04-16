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
const mongoose_1 = __importStar(require("mongoose"));
/* =========================
   SCHEMA
========================= */
const doctorAvailabilitySchema = new mongoose_1.Schema({
    doctor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
        index: true,
    },
    day: {
        type: String,
        required: true,
        enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ],
        index: true,
    },
    startTime: {
        type: String,
        required: true,
        trim: true,
    },
    endTime: {
        type: String,
        required: true,
        trim: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
        index: true,
    },
}, {
    timestamps: true,
});
/* =========================
   IMPORTANT INDEXES (PRODUCTION SAFETY)
========================= */
/**
 * Prevent duplicate schedule slots per doctor
 * Example: same doctor cannot create same day + time twice
 */
doctorAvailabilitySchema.index({ doctor: 1, day: 1, startTime: 1, endTime: 1 }, { unique: true });
/**
 * Fast lookup by doctor schedule
 */
doctorAvailabilitySchema.index({ doctor: 1, day: 1 });
/* =========================
   MODEL
========================= */
const DoctorAvailability = mongoose_1.default.models.DoctorAvailability ||
    mongoose_1.default.model("DoctorAvailability", doctorAvailabilitySchema);
exports.default = DoctorAvailability;
