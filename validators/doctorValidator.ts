import { z } from "zod";

/* =========================
   COMMON FIELDS
========================= */
const nameField = z.string().min(2, "Must be at least 2 characters").max(50);

/* =========================
   DOCTOR ID PARAM (FIXES YOUR ERROR)
========================= */
export const doctorIdSchema = z.object({
  id: z.string().min(1, "Doctor ID is required"),
});

/* =========================
   UPDATE MY PROFILE (DOCTOR)
========================= */
export const updateMyProfileSchema = z.object({
  firstName: nameField.optional(),
  lastName: nameField.optional(),

  specialization: z.string().min(2).optional(),
  experience: z.number().min(0).optional(),

  bio: z.string().max(1000).optional(),
  clinicAddress: z.string().optional(),

  consultationFee: z.number().min(0).optional(),

  availability: z.enum(["available", "unavailable"]).optional(),
  hospital: z.string().optional(),
});

/* =========================
   TYPES
========================= */
export type UpdateMyProfileInput = z.infer<typeof updateMyProfileSchema>;
export type DoctorIdInput = z.infer<typeof doctorIdSchema>;