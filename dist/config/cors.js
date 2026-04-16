"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOriginAllowed = exports.allowedOrigins = exports.getCorsMiddleware = void 0;
const cors_1 = __importDefault(require("cors"));
/**
 * ===============================
 * Allowed Origins
 * ===============================
 */
const getAllowedOrigins = () => {
    const origins = [
        process.env.CLIENT_URL,
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:4200",
    ];
    return Array.from(new Set(origins.filter((origin) => Boolean(origin))));
};
/**
 * ===============================
 * Development CORS Origin Validator
 * ===============================
 */
const corsOriginValidator = (origin, callback) => {
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
const developmentCorsOptions = {
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
const productionCorsOptions = {
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
const getCorsMiddleware = () => {
    const isProduction = process.env.NODE_ENV === "production";
    const options = isProduction ? productionCorsOptions : developmentCorsOptions;
    if (isProduction && !process.env.CLIENT_URL) {
        console.error("❌ CLIENT_URL must be set in production environment");
    }
    return (0, cors_1.default)(options);
};
exports.getCorsMiddleware = getCorsMiddleware;
/**
 * ===============================
 * Export helpers
 * ===============================
 */
exports.allowedOrigins = getAllowedOrigins();
const isOriginAllowed = (origin) => {
    if (!origin)
        return false;
    return getAllowedOrigins().includes(origin);
};
exports.isOriginAllowed = isOriginAllowed;
exports.default = developmentCorsOptions;
