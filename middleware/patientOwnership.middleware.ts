import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import Patient from "../models/patient";

/* =====================================================
   🔐 PATIENT OWNERSHIP CHECK (PRODUCTION SAAS SAFE)
===================================================== */
export const isOwnPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    const patientId = req.params.id;

    if (!patientId) {
      return next(new AppError("Missing patient id", 400));
    }

    /* ================= ADMIN BYPASS ================= */
    if (req.user.role === "admin") {
      return next();
    }

    /* ================= FETCH PATIENT ================= */
    const patient = await Patient.findById(patientId).select("userId");

    if (!patient) {
      return next(new AppError("Patient not found", 404));
    }

    /* ================= OWNERSHIP CHECK ================= */
    if (patient.userId.toString() !== req.user.id) {
      return next(new AppError("Access denied", 403));
    }

    next();
  } catch (err) {
    next(err);
  }
};