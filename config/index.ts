

// export default config;
import { getCorsMiddleware } from "./cors";
import { getHelmetMiddleware } from "./helmet";
import { getMorganMiddleware } from "./morgan";
import {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  uploadLimiter,
  publicLimiter,
  strictLimiter,
} from "./rateLimiter";

/**
 * Environment variables with type safety
 */
interface AppConfig {
  nodeEnv: string;
  port: number;
  mongoUri: string;
  clientUrl: string;
  jwtSecret: string;
  jwtExpire: string;
  apiVersion: string;
}

/**
 * App Configuration
 */
export const config: AppConfig = {
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
export const validateConfig = (): void => {
  const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    console.error(
      `❌ Missing required environment variables: ${missingEnvVars.join(", ")}`
    );
    process.exit(1);
  }

  // extra safety check
  if (!config.mongoUri) {
    console.error("❌ MONGO_URI is not set properly");
    process.exit(1);
  }

  if (
    config.nodeEnv === "production" &&
    config.jwtSecret === "your-secret-key-change-this"
  ) {
    console.error("❌ Please set a secure JWT_SECRET in production");
    process.exit(1);
  }
};

/**
 * Middleware exports
 */
export const middleware = {
  cors: getCorsMiddleware(),
  helmet: getHelmetMiddleware(),
  morgan: getMorganMiddleware(),
  rateLimiters: {
    general: generalLimiter,
    auth: authLimiter,
    passwordReset: passwordResetLimiter,
    upload: uploadLimiter,
    public: publicLimiter,
    strict: strictLimiter,
  },
};

export default config;