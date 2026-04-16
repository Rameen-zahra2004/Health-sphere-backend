"use strict";
// backend/config/morgan.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMorganWithSkip = exports.getMorganErrorOnly = exports.getMorganMiddleware = exports.stream = void 0;
const morgan_1 = __importDefault(require("morgan"));
/**
 * ===============================
 * Constants
 * ===============================
 */
const isProduction = process.env.NODE_ENV === "production";
/**
 * ===============================
 * Custom Morgan Tokens
 * ===============================
 */
// Colored status code
morgan_1.default.token("status-colored", (_req, res) => {
    const status = res.statusCode;
    if (status >= 500)
        return `\x1b[31m${status}\x1b[0m`; // red
    if (status >= 400)
        return `\x1b[33m${status}\x1b[0m`; // yellow
    if (status >= 300)
        return `\x1b[36m${status}\x1b[0m`; // cyan
    if (status >= 200)
        return `\x1b[32m${status}\x1b[0m`; // green
    return `${status}`;
});
// Colored response time (NO any usage)
morgan_1.default.token("response-time-colored", (req, res) => {
    const tokens = morgan_1.default;
    const timeStr = tokens["response-time"](req, res) ?? "";
    const time = Number.parseFloat(timeStr);
    if (Number.isNaN(time))
        return "";
    if (time < 100)
        return `\x1b[32m${time}ms\x1b[0m`;
    if (time < 500)
        return `\x1b[33m${time}ms\x1b[0m`;
    return `\x1b[31m${time}ms\x1b[0m`;
});
// Request body (safe logging)
morgan_1.default.token("body", (req) => {
    if (isProduction)
        return "";
    // Avoid logging sensitive routes
    if (req.path.includes("/auth"))
        return "";
    try {
        return req.body && Object.keys(req.body).length > 0
            ? JSON.stringify(req.body)
            : "";
    }
    catch {
        return "";
    }
});
/**
 * ===============================
 * Log Formats
 * ===============================
 */
const developmentFormat = [
    "\x1b[35m:method\x1b[0m",
    "\x1b[36m:url\x1b[0m",
    ":status-colored",
    ":response-time-colored",
    "\x1b[90m- :res[content-length]\x1b[0m",
    ":body",
].join(" ");
const productionFormat = "combined";
const testFormat = "tiny";
/**
 * ===============================
 * Stream (Production-safe)
 * ===============================
 */
exports.stream = {
    write: (message) => {
        // In real production, replace with Winston/Pino
        console.log(message.trim());
    },
};
/**
 * ===============================
 * Skip Logic
 * ===============================
 */
const skipHealthCheck = (req) => {
    return req.path === "/" || req.path === "/health";
};
/**
 * ===============================
 * Middleware Factory
 * ===============================
 */
const getMorganMiddleware = () => {
    const env = process.env.NODE_ENV ?? "development";
    if (env === "production") {
        return (0, morgan_1.default)(productionFormat, { stream: exports.stream });
    }
    if (env === "test") {
        return (0, morgan_1.default)(testFormat, { stream: exports.stream });
    }
    return (0, morgan_1.default)(developmentFormat, {
        stream: exports.stream,
        skip: (req) => skipHealthCheck(req),
    });
};
exports.getMorganMiddleware = getMorganMiddleware;
/**
 * ===============================
 * Error Logger (status >= 400)
 * ===============================
 */
const getMorganErrorOnly = () => (0, morgan_1.default)(developmentFormat, {
    stream: exports.stream,
    skip: (_req, res) => res.statusCode < 400,
});
exports.getMorganErrorOnly = getMorganErrorOnly;
/**
 * ===============================
 * Custom Skip Middleware
 * ===============================
 */
const getMorganWithSkip = (skipFn) => (0, morgan_1.default)(developmentFormat, {
    stream: exports.stream,
    skip: (req, res) => skipFn(req, res),
});
exports.getMorganWithSkip = getMorganWithSkip;
exports.default = exports.getMorganMiddleware;
