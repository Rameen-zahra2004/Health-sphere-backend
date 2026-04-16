import rateLimit, { Options } from "express-rate-limit";
import { Request, Response, RequestHandler } from "express";

/**
 * Express rate limit handler type
 */
type RateLimitRequestHandler = RequestHandler;

/**
 * Standard JSON response for rate limit errors
 */
const rateLimitHandler = (
  req: Request,
  res: Response,
  options?: { message?: string }
) => {
  res.status(429).json({
    success: false,
    error: "RATE_LIMIT_EXCEEDED",
    message:
      options?.message ||
      "Too many requests. Please slow down and try again later.",
    retryAfter: res.getHeader("Retry-After") || undefined,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
};

/**
 * Base configuration (shared)
 */
const baseConfig = {};

/**
 * General API limiter
 * 100 requests / 15 min
 */
export const generalLimiter: RateLimitRequestHandler = rateLimit({
  ...baseConfig,
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res) =>
    rateLimitHandler(req, res, {
      message:
        "Too many requests from this IP. Please try again after 15 minutes.",
    }),
});

/**
 * Authentication limiter
 * 5 requests / 15 min
 */
export const authLimiter: RateLimitRequestHandler = rateLimit({
  ...baseConfig,
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  handler: (req, res) =>
    rateLimitHandler(req, res, {
      message:
        "Too many authentication attempts. Please try again later.",
    }),
});

/**
 * Password reset limiter
 * 3 requests / hour
 */
export const passwordResetLimiter: RateLimitRequestHandler = rateLimit({
  ...baseConfig,
  windowMs: 60 * 60 * 1000,
  max: 3,
  handler: (req, res) =>
    rateLimitHandler(req, res, {
      message:
        "Too many password reset requests. Please try again in an hour.",
    }),
});

/**
 * File upload limiter
 * 10 requests / hour
 */
export const uploadLimiter: RateLimitRequestHandler = rateLimit({
  ...baseConfig,
  windowMs: 60 * 60 * 1000,
  max: 10,
  handler: (req, res) =>
    rateLimitHandler(req, res, {
      message:
        "Upload limit exceeded. Please try again later.",
    }),
});

/**
 * Public routes limiter
 * 200 requests / 15 min
 */
export const publicLimiter: RateLimitRequestHandler = rateLimit({
  ...baseConfig,
  windowMs: 15 * 60 * 1000,
  max: 200,
  handler: (req, res) => rateLimitHandler(req, res),
});

/**
 * Very strict limiter
 * 3 requests / 15 min
 */
export const strictLimiter: RateLimitRequestHandler = rateLimit({
  ...baseConfig,
  windowMs: 15 * 60 * 1000,
  max: 3,
  handler: (req, res) =>
    rateLimitHandler(req, res, {
      message:
        "Too many attempts for this sensitive operation.",
    }),
});

/**
 * Custom limiter factory
 */
export const createRateLimiter = (
  options: Partial<Options>
): RateLimitRequestHandler => {
  return rateLimit({
    ...baseConfig,
    windowMs: 15 * 60 * 1000,
    max: 100,
    handler: (req, res) => rateLimitHandler(req, res),
    ...options,
  });
};

/**
 * Skip limiter for whitelisted IPs
 */
export const skipRateLimitForWhitelist = (req: Request): boolean => {
  const whitelist = (process.env.RATE_LIMIT_WHITELIST || "")
    .split(",")
    .map((ip) => ip.trim())
    .filter(Boolean);

  const clientIP = req.ip || req.socket.remoteAddress || "";
  return whitelist.includes(clientIP);
};

export default generalLimiter;