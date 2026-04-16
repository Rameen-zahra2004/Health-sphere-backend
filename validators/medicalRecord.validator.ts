import { z } from "zod";

/* ================= CREATE MEDICAL RECORD ================= */
export const createMedicalRecordSchema = z.object({
  disease: z
    .string()
    .min(2, "Disease must be at least 2 characters")
    .max(100),

  symptoms: z
    .string()
    .min(2, "Symptoms must be at least 2 characters")
    .max(500),

  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(1000),
});

/* ================= UPDATE MEDICAL RECORD ================= */
export const updateMedicalRecordSchema = z.object({
  disease: z.string().min(2).max(100).optional(),
  symptoms: z.string().min(2).max(500).optional(),
  description: z.string().min(5).max(1000).optional(),
});