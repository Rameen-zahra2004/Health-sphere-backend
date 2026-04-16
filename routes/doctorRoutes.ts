import express from "express";

import { protect } from "../middleware/authMiddleware";
import { isDoctor } from "../middleware/doctor.middleware";
import { validateBody } from "../middleware/validationMiddleware";

import { updateMyProfileSchema } from "../validators/doctorValidator";

import {
  getMyProfile,
  updateMyProfile,
  getDashboard,
  getMyPatients,
  getMyAppointments,
} from "../controllers/doctorController";

const router = express.Router();

/* =========================
   DOCTOR PROFILE
========================= */
router.get("/profile", protect, isDoctor, getMyProfile);

router.put(
  "/profile",
  protect,
  isDoctor,
  validateBody(updateMyProfileSchema),
  updateMyProfile
);

/* =========================
   DASHBOARD
========================= */
router.get("/dashboard", protect, isDoctor, getDashboard);

/* =========================
   PATIENTS
========================= */
router.get("/patients", protect, isDoctor, getMyPatients);

/* =========================
   APPOINTMENTS
========================= */
router.get("/appointments", protect, isDoctor, getMyAppointments);

export default router;