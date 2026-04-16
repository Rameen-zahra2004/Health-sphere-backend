"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// logger.ts
const winston_1 = require("winston");
// Create a reusable Winston logger
const logger = (0, winston_1.createLogger)({
    level: "info",
    format: winston_1.format.combine(winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json()),
    defaultMeta: { service: "health-sphere-backend" },
    transports: [
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple()),
        }),
        new winston_1.transports.File({ filename: "logs/error.log", level: "error" }),
        new winston_1.transports.File({ filename: "logs/combined.log" }),
    ],
});
// ✅ Export it
exports.default = logger;
