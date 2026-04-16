import { Router } from "express";
import {
  createMedicalRecord,
  getMyRecords,
  getAllRecords,
  getSingleRecord,
  updateRecord,
  deleteRecord,
} from "../controllers/medicalRecordController";

import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

/* ================= GLOBAL PROTECTION ================= */
router.use(protect);

/* ================= CREATE MEDICAL RECORD ================= */
router.post("/", authorize("doctor", "admin"), createMedicalRecord);

/* ================= MY RECORDS ================= */
router.get(
  "/my-records",
  authorize("patient", "doctor", "admin"),
  getMyRecords
);

/* ================= ALL RECORDS ================= */
router.get("/", authorize("doctor", "admin"), getAllRecords);

/* ================= SINGLE RECORD ================= */
router.get("/:id", authorize("doctor", "admin", "patient"), getSingleRecord);

/* ================= UPDATE RECORD ================= */
router.put("/:id", authorize("doctor", "admin", "patient"), updateRecord);

/* ================= DELETE RECORD ================= */
router.delete("/:id", authorize("doctor", "admin"), deleteRecord);

export default router;