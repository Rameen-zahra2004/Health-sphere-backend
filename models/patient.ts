
import { Schema, model } from "mongoose";

const patientSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },

    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, default: "" },

    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },

    emergencyContact: {
      name: String,
      phone: String,
      relation: String,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model("Patient", patientSchema);