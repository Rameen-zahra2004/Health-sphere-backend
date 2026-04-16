"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
/* ================= AUTH ================= */
const auth_route_1 = __importDefault(require("./auth.route"));
/* ================= USERS ================= */
const patientRoutes_1 = __importDefault(require("./patientRoutes"));
const doctorRoutes_1 = __importDefault(require("./doctorRoutes"));
/* ================= ADMIN ================= */
const admin_routes_1 = __importDefault(require("./admin.routes"));
/* ================= HOSPITAL MODULES ================= */
const stats_route_1 = __importDefault(require("./stats.route"));
const medicalRecordRoutes_1 = __importDefault(require("./medicalRecordRoutes"));
const appointmentRoutes_1 = __importDefault(require("./appointmentRoutes"));
const router = (0, express_1.Router)();
/* ================= CORE MODULE ROUTES ================= */
router.use("/auth", auth_route_1.default);
router.use("/patients", patientRoutes_1.default);
router.use("/doctors", doctorRoutes_1.default);
/* ================= ADMIN ROUTES ================= */
router.use("/admin", admin_routes_1.default);
/* ================= APPOINTMENTS ================= */
router.use("/appointments", appointmentRoutes_1.default);
/* ================= MEDICAL SYSTEM ================= */
router.use("/medical-records", medicalRecordRoutes_1.default);
/* ================= ANALYTICS ================= */
router.use("/stats", stats_route_1.default);
/* ================= HEALTH CHECK ================= */
router.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Health Sphere API is running 🚀",
        timestamp: new Date().toISOString(),
    });
});
exports.default = router;
