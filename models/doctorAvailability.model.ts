import mongoose, { Schema, Document, Types, Model } from "mongoose";

/* =========================
   TYPES
========================= */
export interface DoctorAvailabilityDocument extends Document {
  doctor: Types.ObjectId;

  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";

  startTime: string; // "09:00"
  endTime: string;   // "17:00"

  isAvailable: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/* =========================
   SCHEMA
========================= */
const doctorAvailabilitySchema = new Schema<DoctorAvailabilityDocument>(
  {
    doctor: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

/* =========================
   IMPORTANT INDEXES (PRODUCTION SAFETY)
========================= */

/**
 * Prevent duplicate schedule slots per doctor
 * Example: same doctor cannot create same day + time twice
 */
doctorAvailabilitySchema.index(
  { doctor: 1, day: 1, startTime: 1, endTime: 1 },
  { unique: true }
);

/**
 * Fast lookup by doctor schedule
 */
doctorAvailabilitySchema.index({ doctor: 1, day: 1 });

/* =========================
   MODEL
========================= */
const DoctorAvailability: Model<DoctorAvailabilityDocument> =
  mongoose.models.DoctorAvailability ||
  mongoose.model<DoctorAvailabilityDocument>(
    "DoctorAvailability",
    doctorAvailabilitySchema
  );

export default DoctorAvailability;