"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const availability_routes_1 = __importDefault(require("./routes/availability.routes"));
const patientRoutes_1 = __importDefault(require("./routes/patientRoutes"));
const stats_route_1 = __importDefault(require("./routes/stats.route"));
const medicalRecordRoutes_1 = __importDefault(require("./routes/medicalRecordRoutes"));
const appointmentRoutes_1 = __importDefault(require("./routes/appointmentRoutes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const doctorRoutes_1 = __importDefault(require("./routes/doctorRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
/* =========================
   TRUST PROXY
========================= */
app.set("trust proxy", 1);
/* =========================
   SECURITY
========================= */
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
}));
app.use((0, helmet_1.default)());
/* =========================
   RATE LIMIT
========================= */
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
}));
/* =========================
   BODY PARSER
========================= */
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
/* =========================
   LOGGING
========================= */
if (process.env.NODE_ENV !== "production") {
    app.use((0, morgan_1.default)("dev"));
}
/* =========================
   HEALTH CHECK
========================= */
app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Health Sphere API running",
    });
});
/* =========================
   🚨 FIXED ROUTES ORDER
========================= */
app.use("/api/patients", patientRoutes_1.default);
app.use("/api/medical-records", medicalRecordRoutes_1.default);
app.use("/api/appointments", appointmentRoutes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use("/api", stats_route_1.default);
app.use("/api/availability", availability_routes_1.default);
app.use("/api/doctors", doctorRoutes_1.default);
/* =========================
   404 HANDLER
========================= */
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});
exports.default = app;
