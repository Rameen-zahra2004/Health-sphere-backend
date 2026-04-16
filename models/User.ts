
import mongoose, { Schema, HydratedDocument, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

/* ================= TYPES ================= */

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "patient" | "doctor" | "admin";

  phone?: string;
  department?: string;

  isActive: boolean;
  isVerified: boolean;

  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  emailVerificationToken?: string;
}

/* ================= METHODS ================= */

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
  getSignedJwtToken(): string;
  getRefreshToken(): string;
  getResetPasswordToken(): string;
}

/* ================= FIXED MODEL TYPE ================= */

type UserModel = Model<IUser, Record<string, never>, IUserMethods>;
export type UserDocument = HydratedDocument<IUser, IUserMethods>;

/* ================= SCHEMA ================= */

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
      index: true,
    },

    phone: {
      type: String,
      default: "",
    },

    department: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    refreshToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerificationToken: String,
  },
  {
    timestamps: true,
  }
);

/* ================= PASSWORD HASH ================= */

UserSchema.pre("save", async function (this: UserDocument) {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/* ================= METHODS ================= */

UserSchema.methods.comparePassword = async function (
  this: UserDocument,
  enteredPassword: string
) {
  return bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getSignedJwtToken = function (this: UserDocument) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(
    {
      id: this._id.toString(),
      role: this.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

UserSchema.methods.getRefreshToken = function (this: UserDocument) {
  const token = crypto.randomBytes(40).toString("hex");
  this.refreshToken = token;
  return token;
};

UserSchema.methods.getResetPasswordToken = function (this: UserDocument) {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

/* ================= EXPORT ================= */

const User =
  mongoose.models.User ||
  mongoose.model<IUser, UserModel>("User", UserSchema);

export default User;