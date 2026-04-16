"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const medicalRecordController_1 = require("../controllers/medicalRecordController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const role_middleware_1 = require("../middleware/role.middleware");
const router = (0, express_1.Router)();
/* ================= GLOBAL PROTECTION ================= */
router.use(authMiddleware_1.protect);
/* ================= CREATE MEDICAL RECORD ================= */
router.post("/", (0, role_middleware_1.authorize)("doctor", "admin"), medicalRecordController_1.createMedicalRecord);
/* ================= MY RECORDS ================= */
router.get("/my-records", (0, role_middleware_1.authorize)("patient", "doctor", "admin"), medicalRecordController_1.getMyRecords);
/* ================= ALL RECORDS ================= */
router.get("/", (0, role_middleware_1.authorize)("doctor", "admin"), medicalRecordController_1.getAllRecords);
/* ================= SINGLE RECORD ================= */
router.get("/:id", (0, role_middleware_1.authorize)("doctor", "admin", "patient"), medicalRecordController_1.getSingleRecord);
/* ================= UPDATE RECORD ================= */
router.put("/:id", (0, role_middleware_1.authorize)("doctor", "admin", "patient"), medicalRecordController_1.updateRecord);
/* ================= DELETE RECORD ================= */
router.delete("/:id", (0, role_middleware_1.authorize)("doctor", "admin"), medicalRecordController_1.deleteRecord);
exports.default = router;
