
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User";

export type UserRole =
  | "admin"
  | "doctor"
  | "patient"
  | "receptionist";

interface DecodedToken extends JwtPayload {
  id: string;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("\n========== AUTH DEBUG START ==========");

  // ✅ 1. Log headers
  console.log("AUTH HEADER RECEIVED:", req.headers.authorization);

  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    console.log("❌ Missing or invalid Bearer token");
    res.status(401).json({
      success: false,
      message: "Not authorized, token missing",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  console.log("🔑 TOKEN RECEIVED:", token);

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.log("❌ JWT_SECRET missing in env");
    res.status(500).json({
      success: false,
      message: "Server misconfiguration",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as DecodedToken;

    console.log("✅ DECODED TOKEN:", decoded);

    const user = await User.findById(decoded.id).select("_id role");

    console.log("👤 USER FROM DB:", user);

    if (!user) {
      console.log("❌ User not found in DB");
      res.status(401).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    (req as Request & {
      user?: { id: string; role: UserRole };
    }).user = {
      id: user._id.toString(),
      role: user.role as UserRole,
    };

    console.log("✅ AUTH SUCCESS:", req.user);
    console.log("========== AUTH DEBUG END ==========\n");

    next();
  } catch (err) {
    console.log("❌ JWT ERROR:", err);

    res.status(401).json({
      success: false,
      message: "Not authorized, token invalid or expired",
    });
  }
};
