import { Request, Response, NextFunction } from "express";
import { UserRole } from "./authMiddleware";

/**
 * ===============================
 * ROLE-BASED ACCESS CONTROL
 * ===============================
 */
export const authorize =
  (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as Request & {
      user?: { id: string; role: UserRole };
    }).user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({
        success: false,
        message: "Access denied: insufficient permissions",
      });
      return;
    }

    next();
  };