
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import availabilityRoutes from "./routes/availability.routes";
import patientRoutes from "./routes/patientRoutes";
import statsRoutes from "./routes/stats.route";
import medicalRecordRoutes from "./routes/medicalRecordRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import adminRoutes from "./routes/admin.routes";
import doctorRoutes from "./routes/doctorRoutes";
dotenv.config();

const app = express();

/* =========================
   TRUST PROXY
========================= */
app.set("trust proxy", 1);

/* =========================
   SECURITY
========================= */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(helmet());

/* =========================
   RATE LIMIT
========================= */
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/* =========================
   BODY PARSER
========================= */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* =========================
   LOGGING
========================= */
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/* =========================
   HEALTH CHECK
========================= */
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Health Sphere API running",
  });
});

/* =========================
   🚨 FIXED ROUTES ORDER
========================= */
app.use("/api/patients", patientRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", statsRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/doctors", doctorRoutes);
/* =========================
   404 HANDLER
========================= */
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
