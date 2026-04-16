import Doctor from "../models/doctor";
import Appointment from "../models/Appointment";
import { AppError } from "../utils/AppError";
import { UpdateDoctorDTO } from "../types/doctor";

/* ================= GET DOCTOR ================= */
export const getDoctorByUserId = async (userId: string) => {
  const doctor = await Doctor.findOne({ userId, isDeleted: false })
    .select("-password")
    .lean();

  if (!doctor) throw new AppError("Doctor not found", 404);

  return doctor;
};

/* ================= UPDATE PROFILE ================= */
export const updateDoctorByUserId = async (
  userId: string,
  data: UpdateDoctorDTO
) => {
  const updated = await Doctor.findOneAndUpdate(
    { userId, isDeleted: false },
    data,
    { new: true, runValidators: true }
  )
    .select("-password")
    .lean();

  if (!updated) throw new AppError("Doctor not found", 404);

  return updated;
};

/* ================= DASHBOARD ================= */
export const getDoctorDashboard = async (userId: string) => {
  const doctor = await Doctor.findOne({ userId, isDeleted: false });

  if (!doctor) throw new AppError("Doctor not found", 404);

  const doctorId = doctor._id;

  const [totalAppointments, patients, upcomingAppointments] =
    await Promise.all([
      Appointment.countDocuments({ doctorId }),

      Appointment.distinct("patientId", { doctorId }),

      Appointment.find({
        doctorId,
        date: { $gte: new Date() },
        status: { $in: ["pending", "confirmed"] },
      })
        .sort({ date: 1 })
        .limit(5)
        .populate("patientId", "name email")
        .lean(),
    ]);

  return {
    doctor: {
      name: `${doctor.firstName} ${doctor.lastName}`,
      specialization: doctor.specialization,
      verified: doctor.isVerified,
    },

    stats: {
      totalPatients: patients.length,
      totalAppointments,
      totalReviews: 0,
    },

    upcomingAppointments,
  };
};

/* ================= APPOINTMENTS ================= */
export const getDoctorAppointments = async (userId: string) => {
  const doctor = await Doctor.findOne({ userId, isDeleted: false });

  if (!doctor) throw new AppError("Doctor not found", 404);

  return Appointment.find({ doctorId: doctor._id })
    .sort({ date: -1 })
    .populate("patientId", "name email")
    .lean();
};

/* ================= PATIENTS ================= */
export const getDoctorPatients = async (userId: string) => {
  const doctor = await Doctor.findOne({ userId, isDeleted: false });

  if (!doctor) throw new AppError("Doctor not found", 404);

  return Appointment.aggregate([
    { $match: { doctorId: doctor._id } },
    { $group: { _id: "$patientId" } },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "patient",
      },
    },
    { $unwind: "$patient" },
    {
      $project: {
        _id: "$patient._id",
        name: "$patient.name",
        email: "$patient.email",
      },
    },
  ]);
};