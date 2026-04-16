"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = exports.AppError = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
/* ===============================
   Custom App Error Class
=============================== */
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const isMongoDuplicateError = (err) => {
    return (typeof err === "object" &&
        err !== null &&
        "code" in err &&
        err.code === 11000 &&
        "keyValue" in err);
};
const isMongooseValidationError = (err) => {
    return (err instanceof Error &&
        err.name === "ValidationError" &&
        "errors" in err);
};
/* ===============================
   Global Error Handler
=============================== */
const errorHandler = (err, req, res) => {
    let error;
    /* ===============================
       Normalize Error
    =============================== */
    if (err instanceof AppError) {
        error = err;
    }
    else if (err instanceof Error) {
        error = new AppError(err.message);
    }
    else {
        error = new AppError("Unknown error occurred");
    }
    /* ===============================
       Logging
    =============================== */
    logger_1.default.error("API Error", {
        message: error.message,
        stack: err instanceof Error ? err.stack : undefined,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
    });
    /* ===============================
       Mongoose Errors
    =============================== */
    // Invalid ObjectId
    if (err instanceof Error && err.name === "CastError") {
        error = new AppError("Resource not found", 404);
    }
    // Duplicate key
    if (isMongoDuplicateError(err)) {
        const field = Object.keys(err.keyValue)[0] || "field";
        error = new AppError(`Duplicate value for '${field}'`, 400);
    }
    // Validation error
    if (isMongooseValidationError(err)) {
        const message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
        error = new AppError(message, 400);
    }
    /* ===============================
       JWT Errors
    =============================== */
    if (err instanceof Error && err.name === "JsonWebTokenError") {
        error = new AppError("Invalid token", 401);
    }
    if (err instanceof Error && err.name === "TokenExpiredError") {
        error = new AppError("Token expired", 401);
    }
    /* ===============================
       Response
    =============================== */
    res.status(error.statusCode).json({
        success: false,
        message: error.message,
        ...(process.env.NODE_ENV === "development" && {
            stack: err instanceof Error ? err.stack : undefined,
        }),
    });
};
exports.errorHandler = errorHandler;
/* ===============================
   404 Middleware
=============================== */
const notFound = (req, _res, next) => {
    next(new AppError(`Not Found - ${req.originalUrl}`, 404));
};
exports.notFound = notFound;
