
import Appointment, { IAppointment } from "../models/Appointment";
import { Types } from "mongoose";

/* =========================
   CREATE APPOINTMENT SERVICE
========================= */
export const createAppointmentService = async (
  data: Partial<IAppointment>
): Promise<IAppointment> => {
  const { doctorId, date, time } = data;

  if (!doctorId || !date || !time) {
    throw new Error("doctorId, date, and time are required");
  }

  /* =========================
     VALIDATE OBJECT ID
  ========================= */
  if (!Types.ObjectId.isValid(doctorId)) {
    throw new Error("Invalid doctorId");
  }

  /* =========================
     PREVENT DOUBLE BOOKING
  ========================= */
  const exists = await Appointment.findOne({
    doctorId,
    date,
    time,
    status: { $ne: "cancelled" },
  });

  if (exists) {
    throw new Error("This time slot is already booked");
  }

  const appointment = await Appointment.create({
    doctorId,
    date,
    time,
    patientId: data.patientId,
    reason: data.reason,
    status: data.status ?? "pending",
  });

  return appointment;
};

/* =========================
   GET PATIENT APPOINTMENTS
========================= */
export const getAppointmentsByPatientService = async (
  patientId: string | Types.ObjectId
): Promise<IAppointment[]> => {
  if (!patientId) {
    throw new Error("patientId is required");
  }

  /* =========================
     VALIDATE OBJECT ID
  ========================= */
  if (!Types.ObjectId.isValid(patientId)) {
    throw new Error("Invalid patientId");
  }

  const appointments = await Appointment.find({ patientId })
    .populate("doctorId", "name email")
    .sort({ createdAt: -1 });

  return appointments;
};
/* =========================
   GET ALL APPOINTMENTS (ADMIN)
   - WITH PATIENT + DOCTOR DETAILS
========================= */
export const getAllAppointmentsAdminService = async (): Promise<IAppointment[]> => {
  const appointments = await Appointment.find()
    .populate("doctorId", "name email")
    .populate("patientId", "firstName lastName email phone")
    .sort({ createdAt: -1 });

  return appointments;
};