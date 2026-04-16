
import mongoose, { Schema, Document, Types } from "mongoose";

/**
 * =========================
 * ENUMS
 * =========================
 */
export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"; // ✅ NEW (IMPORTANT for medical record flow)

export interface IAppointment extends Document {
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;

  date: Date;
  time: string;
  reason: string;

  status: AppointmentStatus;

  // 🔥 LINK TO MEDICAL RECORD
  medicalRecordId?: Types.ObjectId | null;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * =========================
 * SCHEMA
 * =========================
 */
const AppointmentSchema = new Schema<IAppointment>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    time: {
      type: String,
      required: true,
      trim: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
      index: true,
    },

    /**
     * =========================
     * MEDICAL RECORD LINK
     * =========================
     */
    medicalRecordId: {
      type: Schema.Types.ObjectId,
      ref: "MedicalRecord",
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * =========================
 * INDEXES (PRODUCTION READY)
 * =========================
 */

// Prevent double booking
AppointmentSchema.index(
  { doctorId: 1, date: 1, time: 1 },
  { unique: true }
);

// Fast patient lookup
AppointmentSchema.index({ patientId: 1, createdAt: -1 });

// Fast doctor schedule lookup
AppointmentSchema.index({ doctorId: 1, date: 1 });

/**
 * =========================
 * MODEL EXPORT
 * =========================
 */
const Appointment =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);

export default Appointment;