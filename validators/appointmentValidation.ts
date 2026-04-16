import { Types } from "mongoose";

export interface AppointmentInput {
  doctorId: string | Types.ObjectId;
  date: string;
  time: string;
  reason: string;
}

/**
 * =========================
 * VALIDATE APPOINTMENT INPUT
 * =========================
 */
export const validateAppointment = (data: AppointmentInput): void => {
  const { doctorId, date, time, reason } = data;

  // Check required fields
  if (!doctorId) {
    throw new Error("Doctor ID is required");
  }

  if (!date) {
    throw new Error("Date is required");
  }

  if (!time) {
    throw new Error("Time is required");
  }

  if (!reason) {
    throw new Error("Reason is required");
  }

  // Trim validation
  if (typeof reason === "string" && reason.trim().length < 5) {
    throw new Error("Reason must be at least 5 characters");
  }

  // Date validation (must be valid future or today date)
  const appointmentDate = new Date(date);
  if (isNaN(appointmentDate.getTime())) {
    throw new Error("Invalid date format");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (appointmentDate < today) {
    throw new Error("Appointment date cannot be in the past");
  }

  // Time format validation (HH:MM 24-hour format)
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(time)) {
    throw new Error("Invalid time format (expected HH:MM)");
  }
};