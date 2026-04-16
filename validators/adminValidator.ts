import { z } from "zod";

/* =========================
   CREATE ADMIN VALIDATION
========================= */
export const createAdminSchema = z.object({
  firstName: z.string().min(2, "First name is required").trim(),
  lastName: z.string().min(2, "Last name is required").trim(),

  email: z.string().email("Invalid email format").toLowerCase().trim(),

  password: z.string().min(6, "Password must be at least 6 characters"),

  phone: z
    .string()
    .min(10, "Invalid phone number")
    .max(15)
    .optional(),

  department: z.string().optional(),
});

/* =========================
   UPDATE ADMIN VALIDATION
========================= */
export const updateAdminSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),

  phone: z.string().min(10).max(15).optional(),

  department: z.string().optional(),
});
/* =========================
   OPTIONAL: PARAM VALIDATION
========================= */
export const adminIdSchema = z.object({
  id: z.string().min(1, "Admin ID is required"),
});