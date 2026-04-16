"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
        this.isOperational = true;
        // Fix prototype chain (important for instanceof checks)
        Object.setPrototypeOf(this, new.target.prototype);
        // Capture stack trace (V8 engines like Node.js)
        Error.captureStackTrace?.(this, this.constructor);
    }
}
exports.AppError = AppError;
