import { Response, NextFunction, Request } from "express";
import * as doctorDashboardService from "../services/doctorService";
import { AppError } from "../utils/AppError";

/* ================= TYPES ================= */
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

/* ================= PROFILE ================= */
export const getMyProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);

    const doctor = await doctorDashboardService.getDoctorByUserId(
      req.user.id
    );

    res.json({ success: true, data: doctor });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);

    const doctor = await doctorDashboardService.updateDoctorByUserId(
      req.user.id,
      req.body
    );

    res.json({ success: true, data: doctor });
  } catch (error) {
    next(error);
  }
};

/* ================= DASHBOARD ================= */
export const getDashboard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);

    const data = await doctorDashboardService.getDoctorDashboard(
      req.user.id
    );

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/* ================= PATIENTS ================= */
export const getMyPatients = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);

    const patients = await doctorDashboardService.getDoctorPatients(
      req.user.id
    );

    res.json({ success: true, data: patients });
  } catch (error) {
    next(error);
  }
};

/* ================= APPOINTMENTS ================= */
export const getMyAppointments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);

    const appointments =
      await doctorDashboardService.getDoctorAppointments(
        req.user.id
      );

    res.json({ success: true, data: appointments });
  } catch (error) {
    next(error);
  }
};