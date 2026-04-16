"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointmentController_1 = require("../controllers/appointmentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const role_middleware_1 = require("../middleware/role.middleware");
const router = (0, express_1.Router)();
/**
 * =========================
 * GLOBAL PROTECTION
 * =========================
 * All routes require authentication
 */
router.use(authMiddleware_1.protect);
/**
 * =========================
 * PATIENT ROUTES
 * =========================
 */
// Create appointment (Patient only)
router.post("/", (0, role_middleware_1.authorize)("patient"), appointmentController_1.createAppointment);
// Get logged-in patient appointments
router.get("/my", (0, role_middleware_1.authorize)("patient"), appointmentController_1.getMyAppointments);
// Cancel appointment (Patient only)
router.patch("/cancel/:id", (0, role_middleware_1.authorize)("patient"), appointmentController_1.cancelAppointment);
/**
 * =========================
 * DOCTOR ROUTES
 * =========================
 */
// Doctor: view all assigned appointments
router.get("/doctor", (0, role_middleware_1.authorize)("doctor"), appointmentController_1.getAllAppointmentsForDoctor);
// Doctor: update appointment status (confirm/reject)
router.patch("/status/:id", (0, role_middleware_1.authorize)("doctor"), appointmentController_1.updateAppointmentStatus);
// 🔥 Doctor: complete appointment + link medical record
router.patch("/complete/:id", (0, role_middleware_1.authorize)("doctor"), appointmentController_1.completeAppointmentWithRecord);
exports.default = router;
