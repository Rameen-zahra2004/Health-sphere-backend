"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patientController_1 = require("../controllers/patientController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const role_middleware_1 = require("../middleware/role.middleware");
const patient_middleware_1 = require("../middleware/patient.middleware");
const patientOwnership_middleware_1 = require("../middleware/patientOwnership.middleware");
const router = (0, express_1.Router)();
/* ================= GLOBAL PROTECTION ================= */
router.use(authMiddleware_1.protect);
/* ================= PATIENT SELF ================= */
router.get("/me", patient_middleware_1.isPatient, patientController_1.getMyProfile);
/* ================= MY APPOINTMENTS ================= */
router.get("/my-appointments", patient_middleware_1.isPatient, patientController_1.getMyAppointments);
/* ================= ADMIN / STAFF ================= */
router.get("/", (0, role_middleware_1.authorize)("admin", "doctor", "receptionist"), patientController_1.getPatients);
/* ================= SINGLE PATIENT ================= */
router.get("/:id", (0, role_middleware_1.authorize)("admin", "doctor", "receptionist"), patientController_1.getPatient);
/* ================= CREATE PATIENT ================= */
router.post("/", (0, role_middleware_1.authorize)("admin", "receptionist"), patientController_1.createPatient);
/* ================= UPDATE PATIENT ================= */
router.put("/:id", (0, role_middleware_1.authorize)("admin", "doctor", "receptionist"), patientOwnership_middleware_1.isOwnPatient, patientController_1.updatePatient);
/* ================= DELETE PATIENT ================= */
router.delete("/:id", (0, role_middleware_1.authorize)("admin"), patientController_1.deletePatient);
exports.default = router;
