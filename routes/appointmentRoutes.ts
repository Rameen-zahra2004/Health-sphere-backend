import { Router } from "express";
import {
  createAppointment,
  getMyAppointments,
  getAllAppointmentsForDoctor,
  updateAppointmentStatus,
  cancelAppointment,
  completeAppointmentWithRecord, // 🔥 IMPORTANT LINK ROUTE
} from "../controllers/appointmentController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

/**
 * =========================
 * GLOBAL PROTECTION
 * =========================
 * All routes require authentication
 */
router.use(protect);

/**
 * =========================
 * PATIENT ROUTES
 * =========================
 */

// Create appointment (Patient only)
router.post("/", authorize("patient"), createAppointment);

// Get logged-in patient appointments
router.get("/my", authorize("patient"), getMyAppointments);

// Cancel appointment (Patient only)
router.patch("/cancel/:id", authorize("patient"), cancelAppointment);

/**
 * =========================
 * DOCTOR ROUTES
 * =========================
 */

// Doctor: view all assigned appointments
router.get(
  "/doctor",
  authorize("doctor"),
  getAllAppointmentsForDoctor
);

// Doctor: update appointment status (confirm/reject)
router.patch(
  "/status/:id",
  authorize("doctor"),
  updateAppointmentStatus
);

// 🔥 Doctor: complete appointment + link medical record
router.patch(
  "/complete/:id",
  authorize("doctor"),
  completeAppointmentWithRecord
);

export default router;