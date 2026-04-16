

import { z } from "zod";

/* ================= ADDRESS ================= */
const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

/* ================= EMERGENCY ================= */
const emergencySchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  relation: z.string().optional(),
});

/* ================= CREATE ================= */
export const createPatientSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),

  address: addressSchema.optional(),
  emergencyContact: emergencySchema.optional(),
});

/* ================= UPDATE ================= */
export const updatePatientSchema = createPatientSchema.partial();