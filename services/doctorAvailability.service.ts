import Doctor from "../models/doctor";
import DoctorAvailability from "../models/doctorAvailability.model";
import { AppError } from "../utils/AppError";
import { DoctorAvailabilityDTO } from "../types/doctorAvailability";

/* ================= CREATE AVAILABILITY ================= */
export const setAvailability = async (
  userId: string,
  data: DoctorAvailabilityDTO
) => {
  const doctor = await Doctor.findOne({ userId, isDeleted: false });

  if (!doctor) throw new AppError("Doctor not found", 404);

  const exists = await DoctorAvailability.findOne({
    doctor: doctor._id,
    day: data.day,
    startTime: data.startTime,
    endTime: data.endTime,
  });

  if (exists) {
    throw new AppError("Availability already exists", 409);
  }

  return DoctorAvailability.create({
    doctor: doctor._id,
    ...data,
  });
};

/* ================= GET AVAILABILITY ================= */
export const getAvailability = async (userId: string) => {
  const doctor = await Doctor.findOne({ userId, isDeleted: false });

  if (!doctor) throw new AppError("Doctor not found", 404);

  return DoctorAvailability.find({
    doctor: doctor._id,
  }).sort({ day: 1 });
};

/* ================= UPDATE AVAILABILITY ================= */
export const updateAvailability = async (
  id: string,
  data: Partial<DoctorAvailabilityDTO>
) => {
  const updated = await DoctorAvailability.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  );

  if (!updated) throw new AppError("Availability not found", 404);

  return updated;
};

/* ================= DELETE AVAILABILITY ================= */
export const deleteAvailability = async (id: string) => {
  const deleted = await DoctorAvailability.findByIdAndDelete(id);

  if (!deleted) throw new AppError("Availability not found", 404);

  return { success: true };
};