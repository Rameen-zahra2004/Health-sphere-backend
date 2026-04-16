
import Doctor from "../models/doctor";
import User from "../models/User";
import { AppError } from "../utils/AppError";

/* ===============================
   TYPES
=============================== */

type CreateDoctorInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  specialization: string;
  experience: number;
  bio?: string;
  clinicAddress?: string;
  consultationFee?: number;
};

/* ===============================
   DOCTOR MANAGEMENT
=============================== */

export const getAllDoctors = async () => {
  const doctors = await Doctor.find().sort({ createdAt: -1 });

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
export const createDoctor = async (data: CreateDoctorInput) => {
  const {
    firstName,
    lastName,
    email,
    password,
    specialization,
    experience,
    bio,
    clinicAddress,
    consultationFee,
  } = data;

  console.log("📥 Incoming doctor payload:", data);

  // 1. Check duplicate
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  console.log("🟡 Creating user...");

  // 2. CREATE USER FIRST
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: "doctor",
  });

  console.log("✅ USER CREATED:", user._id);

  if (!user?._id) {
    throw new AppError("User creation failed", 500);
  }

  console.log("🟡 Creating doctor...");

  // 3. CREATE DOCTOR WITH userId
  const doctor = await Doctor.create({
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
/* ===============================
   VERIFY DOCTOR
=============================== */

export const verifyDoctor = async (doctorId: string) => {
  const doctor = await Doctor.findById(doctorId);

  if (!doctor) {
    throw new AppError("Doctor not found", 404);
  }

  doctor.isVerified = true;
  await doctor.save();

  return {
    id: doctor._id.toString(),
    isVerified: doctor.isVerified,
  };
};

/* ===============================
   DELETE DOCTOR
=============================== */

export const deleteDoctor = async (doctorId: string) => {
  const doctor = await Doctor.findById(doctorId);

  if (!doctor) {
    throw new AppError("Doctor not found", 404);
  }

  // ✅ also delete linked user (important)
  await User.findByIdAndDelete(doctor.userId);

  await doctor.deleteOne();

  return {
    success: true,
    message: "Doctor deleted successfully",
  };
};

/* ===============================
   PATIENT MANAGEMENT
=============================== */

export const getAllPatients = async () => {
  const patients = await User.find({ role: "patient" }).select("-password");

  return patients.map((p) => ({
    id: p._id.toString(),
    name: p.name,
    email: p.email,
    createdAt: p.createdAt,
  }));
};

export const deletePatient = async (patientId: string) => {
  const patient = await User.findById(patientId);

  if (!patient) {
    throw new AppError("Patient not found", 404);
  }

  await patient.deleteOne();

  return {
    success: true,
    message: "Patient deleted successfully",
  };
};

/* ===============================
   ADMIN MANAGEMENT
=============================== */

export const createAdmin = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const exists = await User.findOne({ email: data.email });

  if (exists) {
    throw new AppError("User already exists", 409);
  }

  const admin = await User.create({
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