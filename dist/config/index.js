"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = exports.validateConfig = exports.config = void 0;
// export default config;
const cors_1 = require("./cors");
const helmet_1 = require("./helmet");
const morgan_1 = require("./morgan");
const rateLimiter_1 = require("./rateLimiter");
/**
 * App Configuration
 */
exports.config = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "4000", 10),
    // ✅ IMPORTANT FIX: NO localhost fallback
    // mongoUri: process.env.MONGO_URI as string,
    mongoUri: process.env.MONGO_URI || "",
    clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
    jwtSecret: process.env.JWT_SECRET || "your-secret-key-change-this",
    jwtExpire: process.env.JWT_EXPIRE || "7d",
    apiVersion: process.env.API_VERSION || "v1",
};
/**
 * Validate required environment variables
 */
const validateConfig = () => {
    const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];
    const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
    if (missingEnvVars.length > 0) {
        console.error(`❌ Missing required environment variables: ${missingEnvVars.join(", ")}`);
        process.exit(1);
    }
    // extra safety check
    if (!exports.config.mongoUri) {
        console.error("❌ MONGO_URI is not set properly");
        process.exit(1);
    }
    if (exports.config.nodeEnv === "production" &&
        exports.config.jwtSecret === "your-secret-key-change-this") {
        console.error("❌ Please set a secure JWT_SECRET in production");
        process.exit(1);
    }
};
exports.validateConfig = validateConfig;
/**
 * Middleware exports
 */
exports.middleware = {
    cors: (0, cors_1.getCorsMiddleware)(),
    helmet: (0, helmet_1.getHelmetMiddleware)(),
    morgan: (0, morgan_1.getMorganMiddleware)(),
    rateLimiters: {
        general: rateLimiter_1.generalLimiter,
        auth: rateLimiter_1.authLimiter,
        passwordReset: rateLimiter_1.passwordResetLimiter,
        upload: rateLimiter_1.uploadLimiter,
        public: rateLimiter_1.publicLimiter,
        strict: rateLimiter_1.strictLimiter,
    },
};
exports.default = exports.config;
