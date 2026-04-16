import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

/* =====================================================
   🧑 PATIENT ROLE GUARD (PRODUCTION READY)
===================================================== */
export const isPatient = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AppError("Unauthorized", 401));
  }

  if (req.user.role !== "patient") {
    return next(new AppError("Access denied: Patients only", 403));
  }

  next();
};