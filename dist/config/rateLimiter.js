"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.skipRateLimitForWhitelist = exports.createRateLimiter = exports.strictLimiter = exports.publicLimiter = exports.uploadLimiter = exports.passwordResetLimiter = exports.authLimiter = exports.generalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
/**
 * Standard JSON response for rate limit errors
 */
const rateLimitHandler = (req, res, options) => {
    res.status(429).json({
        success: false,
        error: "RATE_LIMIT_EXCEEDED",
        message: options?.message ||
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
exports.generalLimiter = (0, express_rate_limit_1.default)({
    ...baseConfig,
    windowMs: 15 * 60 * 1000,
    max: 100,
    handler: (req, res) => rateLimitHandler(req, res, {
        message: "Too many requests from this IP. Please try again after 15 minutes.",
    }),
});
/**
 * Authentication limiter
 * 5 requests / 15 min
 */
exports.authLimiter = (0, express_rate_limit_1.default)({
    ...baseConfig,
    windowMs: 15 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true,
    handler: (req, res) => rateLimitHandler(req, res, {
        message: "Too many authentication attempts. Please try again later.",
    }),
});
/**
 * Password reset limiter
 * 3 requests / hour
 */
exports.passwordResetLimiter = (0, express_rate_limit_1.default)({
    ...baseConfig,
    windowMs: 60 * 60 * 1000,
    max: 3,
    handler: (req, res) => rateLimitHandler(req, res, {
        message: "Too many password reset requests. Please try again in an hour.",
    }),
});
/**
 * File upload limiter
 * 10 requests / hour
 */
exports.uploadLimiter = (0, express_rate_limit_1.default)({
    ...baseConfig,
    windowMs: 60 * 60 * 1000,
    max: 10,
    handler: (req, res) => rateLimitHandler(req, res, {
        message: "Upload limit exceeded. Please try again later.",
    }),
});
/**
 * Public routes limiter
 * 200 requests / 15 min
 */
exports.publicLimiter = (0, express_rate_limit_1.default)({
    ...baseConfig,
    windowMs: 15 * 60 * 1000,
    max: 200,
    handler: (req, res) => rateLimitHandler(req, res),
});
/**
 * Very strict limiter
 * 3 requests / 15 min
 */
exports.strictLimiter = (0, express_rate_limit_1.default)({
    ...baseConfig,
    windowMs: 15 * 60 * 1000,
    max: 3,
    handler: (req, res) => rateLimitHandler(req, res, {
        message: "Too many attempts for this sensitive operation.",
    }),
});
/**
 * Custom limiter factory
 */
const createRateLimiter = (options) => {
    return (0, express_rate_limit_1.default)({
        ...baseConfig,
        windowMs: 15 * 60 * 1000,
        max: 100,
        handler: (req, res) => rateLimitHandler(req, res),
        ...options,
    });
};
exports.createRateLimiter = createRateLimiter;
/**
 * Skip limiter for whitelisted IPs
 */
const skipRateLimitForWhitelist = (req) => {
    const whitelist = (process.env.RATE_LIMIT_WHITELIST || "")
        .split(",")
        .map((ip) => ip.trim())
        .filter(Boolean);
    const clientIP = req.ip || req.socket.remoteAddress || "";
    return whitelist.includes(clientIP);
};
exports.skipRateLimitForWhitelist = skipRateLimitForWhitelist;
exports.default = exports.generalLimiter;
