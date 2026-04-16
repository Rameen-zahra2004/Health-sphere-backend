"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePasswordSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
/* ===============================
   REGISTER SCHEMA (FIXED)
=============================== */
exports.registerSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2).max(50),
    lastName: zod_1.z.string().min(2).max(50),
    email: zod_1.z.string().email().toLowerCase(),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100),
    role: zod_1.z.enum(["patient", "doctor", "admin"]).optional(),
});
/* ===============================
   LOGIN SCHEMA
=============================== */
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email").toLowerCase(),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
/* ===============================
   FORGOT PASSWORD
=============================== */
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email"),
});
/* ===============================
   RESET PASSWORD
=============================== */
exports.resetPasswordSchema = zod_1.z.object({
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
/* ===============================
   UPDATE PASSWORD
=============================== */
exports.updatePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(6),
    newPassword: zod_1.z.string().min(6),
});
