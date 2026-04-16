
import { Request, Response } from "express";
import crypto from "crypto";

import User, { UserDocument } from "../models/User";
import Patient from "../models/patient";
import { AuthUtils } from "../utils/auth.utils";

/* ================= TYPES ================= */

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

/* ================= SAFE RESPONSE ================= */

const sendAuthResponse = async (
  user: UserDocument,
  statusCode: number,
  res: Response
): Promise<void> => {
  const token = user.getSignedJwtToken();
  const refreshToken = user.getRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.status(statusCode).json({
    user: {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
    token,
  });
};

/* ================= REGISTER ================= */

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const cleanFirstName = firstName?.trim();
    const cleanLastName = lastName?.trim();
    const cleanEmail = email?.trim().toLowerCase();
    const cleanPassword = password;

    if (!cleanFirstName || !cleanLastName || !cleanEmail || !cleanPassword) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    const user = await User.create({
      firstName: cleanFirstName,
      lastName: cleanLastName,
      email: cleanEmail,
      password: cleanPassword,
      role: role ?? "patient",
    });

    // SAFE PATIENT CREATION
    if (user.role === "patient") {
      try {
        const exists = await Patient.findOne({ userId: user._id });

        if (!exists) {
          await Patient.create({
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          });
        }
      } catch (err) {
        console.error("Patient creation failed (ignored):", err);
      }
    }

    await sendAuthResponse(user, 201, res);
  } catch (error: unknown) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

/* ================= LOGIN ================= */

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email & password required" });
    return;
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  await sendAuthResponse(user, 200, res);
};

/* ================= GET ME ================= */

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user?.id) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json({ user });
};

/* ================= LOGOUT ================= */

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.json({ message: "Logged out successfully" });
};

/* ================= REFRESH TOKEN ================= */

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    res.status(401).json({ message: "No refresh token" });
    return;
  }

  const user = await User.findOne({ refreshToken: token });

  if (!user) {
    res.status(401).json({ message: "Invalid refresh token" });
    return;
  }

  const newToken = AuthUtils.generateAccessToken({
    id: user._id,
    role: user.role,
  });

  res.json({ token: newToken });
};

/* ================= FORGOT PASSWORD ================= */

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  res.json({
    message: "Reset link generated",
    resetToken,
  });
};

/* ================= RESET PASSWORD ================= */

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const resetToken = req.params.resetToken;

    if (!resetToken || Array.isArray(resetToken)) {
      res.status(400).json({ message: "Invalid token" });
      return;
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired token" });
      return;
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    await sendAuthResponse(user, 200, res);
  } catch (error: unknown) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

/* ================= UPDATE PASSWORD (FIXED) ================= */

export const updatePassword = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      res.status(401).json({ message: "Incorrect password" });
      return;
    }

    user.password = newPassword;
    await user.save();

    await sendAuthResponse(user, 200, res);
  } catch (error: unknown) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

/* ================= VERIFY EMAIL (FIXED) ================= */

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({
      emailVerificationToken: verificationToken,
    });

    if (!user) {
      res.status(400).json({ message: "Invalid token" });
      return;
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;

    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error: unknown) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};