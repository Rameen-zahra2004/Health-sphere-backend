"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const admin_middleware_1 = require("../middleware/admin.middleware");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const admin_controller_1 = require("../controllers/admin.controller");
const doctorValidator_1 = require("../validators/doctorValidator");
const router = express_1.default.Router();
/* ===============================
   PATIENT ID VALIDATION
=============================== */
const patientIdSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "Patient ID required"),
});
/* ===============================
   DOCTOR ROUTES
=============================== */
/**
 * GET ALL DOCTORS (ADMIN)
 */
router.get("/doctors", authMiddleware_1.protect, // 🔥 MUST COME FIRST
admin_middleware_1.isAdmin, admin_controller_1.getAllDoctors);
/**
 * CREATE DOCTOR (ADMIN)
 */
router.post("/doctors", authMiddleware_1.protect, // 🔥 REQUIRED
admin_middleware_1.isAdmin, admin_controller_1.createDoctor);
/**
 * VERIFY DOCTOR
 */
router.patch("/doctors/:id/verify", authMiddleware_1.protect, admin_middleware_1.isAdmin, (0, validationMiddleware_1.validateParams)(doctorValidator_1.doctorIdSchema), admin_controller_1.verifyDoctor);
/**
 * DELETE DOCTOR
 */
router.delete("/doctors/:id", authMiddleware_1.protect, admin_middleware_1.isAdmin, (0, validationMiddleware_1.validateParams)(doctorValidator_1.doctorIdSchema), admin_controller_1.deleteDoctor);
/* ===============================
   PATIENT ROUTES
=============================== */
/**
 * GET ALL PATIENTS
 */
router.get("/patients", authMiddleware_1.protect, admin_middleware_1.isAdmin, admin_controller_1.getAllPatients);
/**
 * DELETE PATIENT
 */
router.delete("/patients/:id", authMiddleware_1.protect, admin_middleware_1.isAdmin, (0, validationMiddleware_1.validateParams)(patientIdSchema), admin_controller_1.deletePatient);
/* ===============================
   ADMIN ROUTES
=============================== */
/**
 * CREATE ADMIN
 */
router.post("/create-admin", authMiddleware_1.protect, admin_middleware_1.isAdmin, admin_controller_1.createAdmin);
exports.default = router;
