
import { Request, Response, NextFunction } from "express";
import * as adminService from "../services/admin.service";
import { AppError } from "../utils/AppError";

/* ===============================
   SAFE PARAM HELPER (LOCAL)
=============================== */
const getParamId = (
  id: string | string[] | undefined,
  label: string
): string => {
  if (!id || Array.isArray(id)) {
    throw new AppError(`${label} required`, 400);
  }
  return id;
};

/* ===============================
   DOCTORS
=============================== */

/**
 * GET ALL DOCTORS
 */
export const getAllDoctors = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const doctors = await adminService.getAllDoctors();

    res.json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * CREATE DOCTOR ✅ ADDED
 */
export const createDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
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
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !specialization ||
      experience === undefined
    ) {
      throw new AppError("Missing required fields", 400);
    }

    const doctor = await adminService.createDoctor({
      firstName,
      lastName,
      email,
      password,
      specialization,
      experience,
      bio,
      clinicAddress,
      consultationFee,
    });

    res.status(201).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

 /* VERIFY DOCTOR
 */
export const verifyDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = getParamId(req.params.id, "Doctor ID");

    const result = await adminService.verifyDoctor(id);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE DOCTOR
 */
export const deleteDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = getParamId(req.params.id, "Doctor ID");

    const result = await adminService.deleteDoctor(id);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/* ===============================
   PATIENTS
=============================== */

/**
 * GET ALL PATIENTS
 */
export const getAllPatients = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const patients = await adminService.getAllPatients();

    res.json({
      success: true,
      data: patients,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE PATIENT
 */
export const deletePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = getParamId(req.params.id, "Patient ID");

    const result = await adminService.deletePatient(id);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/* ===============================
   ADMIN MANAGEMENT
=============================== */

/**
 * CREATE ADMIN
 */
export const createAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError("All fields are required", 400);
    }

    const admin = await adminService.createAdmin({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};