"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminIdSchema = exports.updateAdminSchema = exports.createAdminSchema = void 0;
const zod_1 = require("zod");
/* =========================
   CREATE ADMIN VALIDATION
========================= */
exports.createAdminSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2, "First name is required").trim(),
    lastName: zod_1.z.string().min(2, "Last name is required").trim(),
    email: zod_1.z.string().email("Invalid email format").toLowerCase().trim(),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    phone: zod_1.z
        .string()
        .min(10, "Invalid phone number")
        .max(15)
        .optional(),
    department: zod_1.z.string().optional(),
});
/* =========================
   UPDATE ADMIN VALIDATION
========================= */
exports.updateAdminSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2).optional(),
    lastName: zod_1.z.string().min(2).optional(),
    phone: zod_1.z.string().min(10).max(15).optional(),
    department: zod_1.z.string().optional(),
});
/* =========================
   OPTIONAL: PARAM VALIDATION
========================= */
exports.adminIdSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "Admin ID is required"),
});
