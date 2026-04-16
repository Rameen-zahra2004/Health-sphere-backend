import { Router } from "express";

import {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  getMyProfile,
  getMyAppointments, // ✅ FIXED IMPORT
} from "../controllers/patientController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/role.middleware";
import { isPatient } from "../middleware/patient.middleware";
import { isOwnPatient } from "../middleware/patientOwnership.middleware";

const router = Router();

/* ================= GLOBAL PROTECTION ================= */
router.use(protect);

/* ================= PATIENT SELF ================= */
router.get("/me", isPatient, getMyProfile);

/* ================= MY APPOINTMENTS ================= */
router.get("/my-appointments", isPatient, getMyAppointments);

/* ================= ADMIN / STAFF ================= */
router.get("/", authorize("admin", "doctor", "receptionist"), getPatients);

/* ================= SINGLE PATIENT ================= */
router.get(
  "/:id",
  authorize("admin", "doctor", "receptionist"),
  getPatient
);

/* ================= CREATE PATIENT ================= */
router.post("/", authorize("admin", "receptionist"), createPatient);

/* ================= UPDATE PATIENT ================= */
router.put(
  "/:id",
  authorize("admin", "doctor", "receptionist"),
  isOwnPatient,
  updatePatient
);

/* ================= DELETE PATIENT ================= */
router.delete("/:id", authorize("admin"), deletePatient);

export default router;