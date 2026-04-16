import mongoose, { Schema, Document, Types, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface DoctorDocument extends Document {
  userId: Types.ObjectId;

  firstName: string;
  lastName: string;
  email: string;

  password: string;

  specialization: string;
  experience: number;

  bio?: string;
  clinicAddress?: string;
  consultationFee?: number;

  availability: "available" | "unavailable";
  hospital?: string;

  isVerified: boolean;

  isDeleted: boolean;
  deletedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;

  comparePassword(password: string): Promise<boolean>;
}

const doctorSchema = new Schema<DoctorDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },

    email: { type: String, required: true, unique: true, lowercase: true },

    password: { type: String, required: true, select: false },

    specialization: { type: String, required: true },
    experience: { type: Number, default: 0 },

    bio: { type: String, default: "" },
    clinicAddress: { type: String, default: "" },
    consultationFee: { type: Number, default: 0 },

    availability: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },

    hospital: { type: String, default: "" },

    isVerified: { type: Boolean, default: false },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

/* HASH PASSWORD */
doctorSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

/* METHOD */
doctorSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

const Doctor: Model<DoctorDocument> =
  mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

export default Doctor;