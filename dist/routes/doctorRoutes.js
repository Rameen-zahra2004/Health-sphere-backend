"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const doctor_middleware_1 = require("../middleware/doctor.middleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const doctorValidator_1 = require("../validators/doctorValidator");
const doctorController_1 = require("../controllers/doctorController");
const router = express_1.default.Router();
/* =========================
   DOCTOR PROFILE
========================= */
router.get("/profile", authMiddleware_1.protect, doctor_middleware_1.isDoctor, doctorController_1.getMyProfile);
router.put("/profile", authMiddleware_1.protect, doctor_middleware_1.isDoctor, (0, validationMiddleware_1.validateBody)(doctorValidator_1.updateMyProfileSchema), doctorController_1.updateMyProfile);
/* =========================
   DASHBOARD
========================= */
router.get("/dashboard", authMiddleware_1.protect, doctor_middleware_1.isDoctor, doctorController_1.getDashboard);
/* =========================
   PATIENTS
========================= */
router.get("/patients", authMiddleware_1.protect, doctor_middleware_1.isDoctor, doctorController_1.getMyPatients);
/* =========================
   APPOINTMENTS
========================= */
router.get("/appointments", authMiddleware_1.protect, doctor_middleware_1.isDoctor, doctorController_1.getMyAppointments);
exports.default = router;
