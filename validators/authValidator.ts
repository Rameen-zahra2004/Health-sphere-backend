
import { z } from "zod";

/* ===============================
   REGISTER SCHEMA (FIXED)
=============================== */
export const registerSchema = z.object({
  firstName: z.string().min(2).max(50),

  lastName: z.string().min(2).max(50),

  email: z.string().email().toLowerCase(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100),

  role: z.enum(["patient", "doctor", "admin"]).optional(),
});

/* ===============================
   LOGIN SCHEMA
=============================== */
export const loginSchema = z.object({
  email: z.string().email("Invalid email").toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/* ===============================
   FORGOT PASSWORD
=============================== */
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

/* ===============================
   RESET PASSWORD
=============================== */
export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/* ===============================
   UPDATE PASSWORD
=============================== */
export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});