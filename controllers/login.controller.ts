import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { AuthUtils } from "../utils/auth.utils";
import User from "../models/User";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  /* =========================
     VALIDATION
  ========================= */
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  /* =========================
     FIND USER (include password)
  ========================= */
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  /* =========================
     CHECK PASSWORD
  ========================= */
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  /* =========================
     GENERATE TOKEN
  ========================= */
  const token = AuthUtils.generateAccessToken({
    id: user._id,
    role: user.role,
  });

  /* =========================
     SAFE USER RESPONSE (NO DELETE ❌)
  ========================= */
  const { password: _, ...safeUser } = user.toObject();

  /* =========================
     RESPONSE
  ========================= */
  res.status(200).json({
    success: true,
    token,
    user: safeUser,
  });
});