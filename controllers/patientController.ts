
import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { getAppointmentsByPatientService } from "../services/appointment.service";
import {
  getMyProfileService,
  getPatientsService,
  getPatientByIdService,
  createPatientService,
  updatePatientService,
  deletePatientService,
} from "../services/patient.service";

import { getSafeParam } from "../utils/getSafeParam";
import {
  createPatientSchema,
  updatePatientSchema,
} from "../validators/patient.validation";

/* ================= RESPONSE HELPER ================= */
const send = (
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data?: unknown
) => {
  return res.status(status).json({ success, message, data });
};

/* ================= MY PROFILE ================= */
export const getMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new Error("Unauthorized");

    const patient = await getMyProfileService(req.user.id);

    if (!patient) {
      return send(res, 404, false, "Patient not found");
    }

    return send(res, 200, true, "Profile fetched", patient);
  } catch (err) {
    next(err);
  }
};

/* ================= ALL PATIENTS ================= */
export const getPatients = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const patients = await getPatientsService();
    return send(res, 200, true, "Patients fetched", patients);
  } catch (err) {
    next(err);
  }
};

/* ================= SINGLE PATIENT ================= */
export const getPatient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getSafeParam(req.params.id, "id");

    const patient = await getPatientByIdService(id);

    if (!patient) {
      return send(res, 404, false, "Patient not found");
    }

    return send(res, 200, true, "Patient fetched", patient);
  } catch (err) {
    next(err);
  }
};

/* ================= CREATE PATIENT ================= */
export const createPatient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = createPatientSchema.safeParse(req.body);

    if (!parsed.success) {
      return send(res, 400, false, "Validation error", parsed.error.flatten());
    }

    const patient = await createPatientService(parsed.data);

    return send(res, 201, true, "Patient created", patient);
  } catch (err) {
    next(err);
  }
};

/* ================= UPDATE PATIENT ================= */
export const updatePatient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getSafeParam(req.params.id, "id");

    const parsed = updatePatientSchema.safeParse(req.body);

    if (!parsed.success) {
      return send(res, 400, false, "Validation error", parsed.error.flatten());
    }

    const patient = await updatePatientService(id, parsed.data);

    if (!patient) {
      return send(res, 404, false, "Patient not found");
    }

    return send(res, 200, true, "Patient updated", patient);
  } catch (err) {
    next(err);
  }
};

/* ================= DELETE PATIENT ================= */
export const deletePatient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getSafeParam(req.params.id, "id");

    const patient = await deletePatientService(id);

    if (!patient) {
      return send(res, 404, false, "Patient not found");
    }

    return send(res, 200, true, "Patient deleted", patient);
  } catch (err) {
    next(err);
  }
};
export const getMyAppointments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new Error("Unauthorized");

    const appointments = await getAppointmentsByPatientService(req.user.id);

    res.json({
      success: true,
      message: "My appointments fetched",
      data: appointments,
    });
  } catch (err) {
    next(err);
  }
};