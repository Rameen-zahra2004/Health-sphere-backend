
import { Request, Response, NextFunction } from "express";

/* =========================
   DOCTOR AUTH MIDDLEWARE
========================= */
export const isDoctor = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized: No user found",
    });
    return;
  }

  if (req.user.role !== "doctor") {
    res.status(403).json({
      success: false,
      message: "Access denied: Doctors only",
    });
    return;
  }

  next();
};