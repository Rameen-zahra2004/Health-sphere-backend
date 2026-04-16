"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePatientSchema = exports.createPatientSchema = void 0;
const zod_1 = require("zod");
/* ================= ADDRESS ================= */
const addressSchema = zod_1.z.object({
    street: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    zipCode: zod_1.z.string().optional(),
});
/* ================= EMERGENCY ================= */
const emergencySchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    relation: zod_1.z.string().optional(),
});
/* ================= CREATE ================= */
exports.createPatientSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2),
    lastName: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().optional(),
    address: addressSchema.optional(),
    emergencyContact: emergencySchema.optional(),
});
/* ================= UPDATE ================= */
exports.updatePatientSchema = exports.createPatientSchema.partial();
