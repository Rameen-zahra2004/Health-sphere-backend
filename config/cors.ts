
import cors, { CorsOptions } from "cors";

/**
 * ===============================
 * Allowed Origins
 * ===============================
 */
const getAllowedOrigins = (): string[] => {
  const origins = [
    process.env.CLIENT_URL,
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:4200",
  ];

  return Array.from(new Set(origins.filter((origin): origin is string => Boolean(origin))));
};

/**
 * ===============================
 * Development CORS Origin Validator
 * ===============================
 */
const corsOriginValidator: CorsOptions["origin"] = (origin, callback) => {
  const allowedOrigins = getAllowedOrigins();

  if (!origin) {
    // Allow requests with no origin (Postman, curl, mobile apps)
    return callback(null, true);
  }

  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }

  console.warn(`⚠️  CORS: Blocked request from unauthorized origin: ${origin}`);
  return callback(new Error(`Origin ${origin} is not allowed by CORS policy`));
};

/**
 * ===============================
 * Development CORS Options
 * ===============================
 */
const developmentCorsOptions: CorsOptions = {
  origin: corsOriginValidator,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
  ],
  exposedHeaders: ["X-Total-Count", "X-Auth-Token", "Content-Range", "X-Content-Range"],
  maxAge: 86400,
  preflightContinue: false,
};

/**
 * ===============================
 * Production CORS Options
 * ===============================
 */
const productionCorsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigin = process.env.CLIENT_URL;

    if (!allowedOrigin) {
      console.error("❌ CORS: CLIENT_URL is not defined in production");
      return callback(new Error("CORS configuration error"));
    }

    if (!origin && process.env.ALLOW_NO_ORIGIN === "true") {
      return callback(null, true);
    }

    if (origin === allowedOrigin) {
      return callback(null, true);
    }

    console.warn(`⚠️  CORS: Blocked production request from: ${origin}`);
    return callback(new Error(`Origin ${origin} is not allowed in production`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["X-Total-Count", "X-Auth-Token"],
  maxAge: 86400,
  preflightContinue: false,
};

/**
 * ===============================
 * Get CORS Middleware
 * ===============================
 */
export const getCorsMiddleware = () => {
  const isProduction = process.env.NODE_ENV === "production";
  const options = isProduction ? productionCorsOptions : developmentCorsOptions;

  if (isProduction && !process.env.CLIENT_URL) {
    console.error("❌ CLIENT_URL must be set in production environment");
  }

  return cors(options);
};

/**
 * ===============================
 * Export helpers
 * ===============================
 */
export const allowedOrigins = getAllowedOrigins();

export const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) return false;
  return getAllowedOrigins().includes(origin);
};

export default developmentCorsOptions;