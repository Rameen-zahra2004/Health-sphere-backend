"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdmin = exports.deletePatient = exports.getAllPatients = exports.deleteDoctor = exports.verifyDoctor = exports.createDoctor = exports.getAllDoctors = void 0;
const doctor_1 = __importDefault(require("../models/doctor"));
const User_1 = __importDefault(require("../models/User"));
const AppError_1 = require("../utils/AppError");
/* ===============================
   DOCTOR MANAGEMENT
=============================== */
const getAllDoctors = async () => {
    const doctors = await doctor_1.default.find().sort({ createdAt: -1 });
    return doctors.map((doc) => ({
        id: doc._id.toString(),
        firstName: doc.firstName,
        lastName: doc.lastName,
        email: doc.email,
        specialization: doc.specialization,
        experience: doc.experience,
        bio: doc.bio,
        clinicAddress: doc.clinicAddress,
        consultationFee: doc.consultationFee,
        isVerified: doc.isVerified,
        availability: doc.availability,
    }));
};
exports.getAllDoctors = getAllDoctors;
/* ===============================
   CREATE DOCTOR (FIXED ✅)
=============================== */
// export const createDoctor = async (data: CreateDoctorInput) => {
//   // ✅ Check if user already exists
//   const existingUser = await User.findOne({ email: data.email });
//   if (existingUser) {
//     throw new AppError("Email already exists", 409);
//   }
//   // ✅ 1. Create USER first
//   const user = await User.create({
//     name: `${data.firstName} ${data.lastName}`,
//     email: data.email,
//     password: data.password, // hashed in User model
//     role: "doctor",
//   });
//   // ✅ 2. Create DOCTOR linked with userId
//   const doctor = await Doctor.create({
//     userId: user._id, // 🔥 FIXED
//     firstName: data.firstName,
//     lastName: data.lastName,
//     email: data.email,
//     password: data.password, // ⚠️ still here (optional to remove later)
//     specialization: data.specialization,
//     experience: data.experience,
//     bio: data.bio || "",
//     clinicAddress: data.clinicAddress || "",
//     consultationFee: data.consultationFee || 0,
//     isVerified: false,
//   });
//   return {
//     id: doctor._id.toString(),
//     firstName: doctor.firstName,
//     lastName: doctor.lastName,
//     email: doctor.email,
//     specialization: doctor.specialization,
//     experience: doctor.experience,
//     isVerified: doctor.isVerified,
//   };
// };
const createDoctor = async (data) => {
    const { firstName, lastName, email, password, specialization, experience, bio, clinicAddress, consultationFee, } = data;
    console.log("📥 Incoming doctor payload:", data);
    // 1. Check duplicate
    const existingUser = await User_1.default.findOne({ email });
    if (existingUser) {
        throw new AppError_1.AppError("Email already exists", 409);
    }
    console.log("🟡 Creating user...");
    // 2. CREATE USER FIRST
    const user = await User_1.default.create({
        firstName,
        lastName,
        email,
        password,
        role: "doctor",
    });
    console.log("✅ USER CREATED:", user._id);
    if (!user?._id) {
        throw new AppError_1.AppError("User creation failed", 500);
    }
    console.log("🟡 Creating doctor...");
    // 3. CREATE DOCTOR WITH userId
    const doctor = await doctor_1.default.create({
        userId: user._id, // 🔥 FIXED
        firstName,
        lastName,
        email,
        password,
        specialization,
        experience,
        bio: bio || "",
        clinicAddress: clinicAddress || "",
        consultationFee: consultationFee || 0,
        isVerified: false,
    });
    console.log("✅ DOCTOR CREATED:", doctor._id);
    return {
        id: doctor._id.toString(),
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        specialization: doctor.specialization,
        experience: doctor.experience,
        isVerified: doctor.isVerified,
    };
};
exports.createDoctor = createDoctor;
/* ===============================
   VERIFY DOCTOR
=============================== */
const verifyDoctor = async (doctorId) => {
    const doctor = await doctor_1.default.findById(doctorId);
    if (!doctor) {
        throw new AppError_1.AppError("Doctor not found", 404);
    }
    doctor.isVerified = true;
    await doctor.save();
    return {
        id: doctor._id.toString(),
        isVerified: doctor.isVerified,
    };
};
exports.verifyDoctor = verifyDoctor;
/* ===============================
   DELETE DOCTOR
=============================== */
const deleteDoctor = async (doctorId) => {
    const doctor = await doctor_1.default.findById(doctorId);
    if (!doctor) {
        throw new AppError_1.AppError("Doctor not found", 404);
    }
    // ✅ also delete linked user (important)
    await User_1.default.findByIdAndDelete(doctor.userId);
    await doctor.deleteOne();
    return {
        success: true,
        message: "Doctor deleted successfully",
    };
};
exports.deleteDoctor = deleteDoctor;
/* ===============================
   PATIENT MANAGEMENT
=============================== */
const getAllPatients = async () => {
    const patients = await User_1.default.find({ role: "patient" }).select("-password");
    return patients.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        email: p.email,
        createdAt: p.createdAt,
    }));
};
exports.getAllPatients = getAllPatients;
const deletePatient = async (patientId) => {
    const patient = await User_1.default.findById(patientId);
    if (!patient) {
        throw new AppError_1.AppError("Patient not found", 404);
    }
    await patient.deleteOne();
    return {
        success: true,
        message: "Patient deleted successfully",
    };
};
exports.deletePatient = deletePatient;
/* ===============================
   ADMIN MANAGEMENT
=============================== */
const createAdmin = async (data) => {
    const exists = await User_1.default.findOne({ email: data.email });
    if (exists) {
        throw new AppError_1.AppError("User already exists", 409);
    }
    const admin = await User_1.default.create({
        name: data.name,
        email: data.email,
        password: data.password,
        role: "admin",
    });
    return {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
    };
};
exports.createAdmin = createAdmin;
