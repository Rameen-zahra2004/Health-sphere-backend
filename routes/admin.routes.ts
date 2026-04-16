import express from "express";
import { z } from "zod";

import { isAdmin } from "../middleware/admin.middleware";
import { protect } from "../middleware/authMiddleware";
import { validateParams } from "../middleware/validationMiddleware";

import {
  getAllDoctors,
  verifyDoctor,
  deleteDoctor,
  getAllPatients,
  deletePatient,
  createAdmin,
  createDoctor, // ✅ FIXED: ADD THIS
} from "../controllers/admin.controller";

import { doctorIdSchema } from "../validators/doctorValidator";

const router = express.Router();

/* ===============================
   PATIENT ID VALIDATION
=============================== */
const patientIdSchema = z.object({
  id: z.string().min(1, "Patient ID required"),
});

/* ===============================
   DOCTOR ROUTES
=============================== */

/**
 * GET ALL DOCTORS (ADMIN)
 */
router.get(
  "/doctors",
  protect,      // 🔥 MUST COME FIRST
  isAdmin,
  getAllDoctors
);

/**
 * CREATE DOCTOR (ADMIN)
 */
router.post(
  "/doctors",
  protect,      // 🔥 REQUIRED
  isAdmin,
  createDoctor
);

/**
 * VERIFY DOCTOR
 */
router.patch(
  "/doctors/:id/verify",
  protect,
  isAdmin,
  validateParams(doctorIdSchema),
  verifyDoctor
);

/**
 * DELETE DOCTOR
 */
router.delete(
  "/doctors/:id",
  protect,
  isAdmin,
  validateParams(doctorIdSchema),
  deleteDoctor
);

/* ===============================
   PATIENT ROUTES
=============================== */

/**
 * GET ALL PATIENTS
 */
router.get(
  "/patients",
  protect,
  isAdmin,
  getAllPatients
);

/**
 * DELETE PATIENT
 */
router.delete(
  "/patients/:id",
  protect,
  isAdmin,
  validateParams(patientIdSchema),
  deletePatient
);

/* ===============================
   ADMIN ROUTES
=============================== */

/**
 * CREATE ADMIN
 */
router.post(
  "/create-admin",
  protect,
  isAdmin,
  createAdmin
);

export default router;