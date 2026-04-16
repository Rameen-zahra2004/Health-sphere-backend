import mongoose, { Document, Schema, Model } from "mongoose";

/* ================= ENUMS ================= */
export const RECORD_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
} as const;

export type RecordStatus =
  (typeof RECORD_STATUS)[keyof typeof RECORD_STATUS];

/* ================= INTERFACE ================= */
export interface IMedicalRecord extends Document {
  patient: mongoose.Types.ObjectId;
  appointment: mongoose.Types.ObjectId;
  disease: string;
  symptoms: string;
  description: string;
  status: RecordStatus;
  doctorAssigned?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

/* ================= SCHEMA ================= */
const MedicalRecordSchema = new Schema<IMedicalRecord>(
  {
    /* ================= PATIENT ================= */
    patient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient is required"],
    },

    /* ================= APPOINTMENT ================= */
    appointment: {
      type: Schema.Types.ObjectId,
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
      enum: Object.values(RECORD_STATUS),
      default: RECORD_STATUS.PENDING,
    },

    /* ================= DOCTOR ================= */
    doctorAssigned: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

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
const MedicalRecord: Model<IMedicalRecord> =
  mongoose.models.MedicalRecord ||
  mongoose.model<IMedicalRecord>("MedicalRecord", MedicalRecordSchema);

export default MedicalRecord;