"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMyProfileSchema = exports.doctorIdSchema = void 0;
const zod_1 = require("zod");
/* =========================
   COMMON FIELDS
========================= */
const nameField = zod_1.z.string().min(2, "Must be at least 2 characters").max(50);
/* =========================
   DOCTOR ID PARAM (FIXES YOUR ERROR)
========================= */
exports.doctorIdSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "Doctor ID is required"),
});
/* =========================
   UPDATE MY PROFILE (DOCTOR)
========================= */
exports.updateMyProfileSchema = zod_1.z.object({
    firstName: nameField.optional(),
    lastName: nameField.optional(),
    specialization: zod_1.z.string().min(2).optional(),
    experience: zod_1.z.number().min(0).optional(),
    bio: zod_1.z.string().max(1000).optional(),
    clinicAddress: zod_1.z.string().optional(),
    consultationFee: zod_1.z.number().min(0).optional(),
    availability: zod_1.z.enum(["available", "unavailable"]).optional(),
    hospital: zod_1.z.string().optional(),
});
