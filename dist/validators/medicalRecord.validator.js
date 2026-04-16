"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMedicalRecordSchema = exports.createMedicalRecordSchema = void 0;
const zod_1 = require("zod");
/* ================= CREATE MEDICAL RECORD ================= */
exports.createMedicalRecordSchema = zod_1.z.object({
    disease: zod_1.z
        .string()
        .min(2, "Disease must be at least 2 characters")
        .max(100),
    symptoms: zod_1.z
        .string()
        .min(2, "Symptoms must be at least 2 characters")
        .max(500),
    description: zod_1.z
        .string()
        .min(5, "Description must be at least 5 characters")
        .max(1000),
});
/* ================= UPDATE MEDICAL RECORD ================= */
exports.updateMedicalRecordSchema = zod_1.z.object({
    disease: zod_1.z.string().min(2).max(100).optional(),
    symptoms: zod_1.z.string().min(2).max(500).optional(),
    description: zod_1.z.string().min(5).max(1000).optional(),
});
