import { Request, Response, NextFunction } from "express";
import * as availabilityService from "../services/doctorAvailability.service";
import { AppError } from "../utils/AppError";
import { getSafeParam } from "../utils/getSafeParam";

/* =========================
   AUTH REQUEST TYPE
========================= */
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

/* =========================
   SET AVAILABILITY
========================= */
export const setAvailability = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);

    const result = await availabilityService.setAvailability(
      req.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET AVAILABILITY
========================= */
export const getAvailability = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);

    const result = await availabilityService.getAvailability(
      req.user.id
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   UPDATE AVAILABILITY
========================= */
export const updateAvailability = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);

    const id = getSafeParam(req.params.id, "Availability ID");

    const result = await availabilityService.updateAvailability(
      id,
      req.body
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   DELETE AVAILABILITY
========================= */
export const deleteAvailability = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);

    const id = getSafeParam(req.params.id, "Availability ID");

    const result = await availabilityService.deleteAvailability(id);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};