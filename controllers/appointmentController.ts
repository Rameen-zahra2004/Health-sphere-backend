import { Request, Response } from "express";
import { Types } from "mongoose";
import Appointment from "../models/Appointment";
import MedicalRecord from "../models/medicalRecord";

import {
  createAppointmentService,
  getAppointmentsByPatientService,
} from "../services/appointment.service";

/* =========================
   SAFE ID NORMALIZER
========================= */
const normalizeId = (id: string | string[] | undefined): string | null => {
  if (!id) return null;
  return Array.isArray(id) ? id[0] : id;
};

/* =========================
   SAFE USER TYPE GUARD
   (NO ANY USED)
========================= */
type AuthUser = {
  id: string;
  role?: "patient" | "doctor" | "admin";
};

const getUser = (req: Request): AuthUser | null => {
  const user = req.user as unknown as AuthUser | undefined;
  return user ?? null;
};

/* =========================
   CREATE APPOINTMENT (PATIENT)
========================= */
export const createAppointment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = getUser(req);

    if (!user?.id) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const appointment = await createAppointmentService({
      patientId: user.id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: appointment,
    });
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create appointment",
    });
  }
};

/* =========================
   GET MY APPOINTMENTS
========================= */
export const getMyAppointments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = getUser(req);

    if (!user?.id) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const appointments = await getAppointmentsByPatientService(user.id);

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch appointments",
    });
  }
};

/* =========================
   DOCTOR APPOINTMENTS
========================= */
export const getAllAppointmentsForDoctor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = getUser(req);

    if (!user?.id) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const appointments = await Appointment.find({
      doctorId: user.id,
    })
      .populate("patientId", "name email")
      .populate("medicalRecordId")
      .sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch appointments",
    });
  }
};

/* =========================
   UPDATE APPOINTMENT STATUS
========================= */
export const updateAppointmentStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rawId = normalizeId(req.params.id);
    const { status } = req.body as { status: string };

    if (!rawId || !Types.ObjectId.isValid(rawId)) {
      res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
      return;
    }

    const appointment = await Appointment.findById(rawId);

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
      return;
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: appointment,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update status",
    });
  }
};

/* =========================
   COMPLETE APPOINTMENT + LINK RECORD
========================= */
export const completeAppointmentWithRecord = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const appointmentId = normalizeId(req.params.id);
    const { medicalRecordId } = req.body as { medicalRecordId: string };

    if (!appointmentId || !Types.ObjectId.isValid(appointmentId)) {
      res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
      return;
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
      return;
    }

    if (!medicalRecordId) {
      res.status(400).json({
        success: false,
        message: "MedicalRecord ID is required",
      });
      return;
    }

    appointment.status = "completed";
    appointment.medicalRecordId = medicalRecordId;

    await appointment.save();

    await MedicalRecord.findByIdAndUpdate(medicalRecordId, {
      appointmentId: appointment._id,
    });

    res.status(200).json({
      success: true,
      message: "Appointment completed and linked successfully",
      data: appointment,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to complete appointment",
    });
  }
};

/* =========================
   CANCEL APPOINTMENT
========================= */
export const cancelAppointment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rawId = normalizeId(req.params.id);

    if (!rawId || !Types.ObjectId.isValid(rawId)) {
      res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
      return;
    }

    const appointment = await Appointment.findByIdAndUpdate(
      rawId,
      { status: "cancelled" },
      { new: true }
    );

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      data: appointment,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to cancel appointment",
    });
  }
};