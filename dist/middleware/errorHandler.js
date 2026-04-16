"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
/**
 * ===============================
 * App Error Class
 * ===============================
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
        this.isOperational = true;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}
exports.AppError = AppError;
/**
 * ===============================
 * TYPE GUARDS
 * ===============================
 */
const isObject = (value) => typeof value === "object" && value !== null;
const isMongoDuplicateError = (err) => {
    return isObject(err) && err.code === 11000;
};
const isMongoValidationError = (err) => {
    return (isObject(err) &&
        err.name === "ValidationError" &&
        isObject(err.errors));
};
const isJWTError = (err) => {
    return (isObject(err) &&
        (err.name === "JsonWebTokenError" ||
            err.name === "TokenExpiredError"));
};
/**
 * ===============================
 * SEND ERROR (DEV)
 * ===============================
 */
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
    });
};
/**
 * ===============================
 * SEND ERROR (PROD)
 * ===============================
 */
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message,
        });
    }
    // Unknown error (DO NOT LEAK DETAILS)
    console.error("💥 ERROR:", err);
    return res.status(500).json({
        success: false,
        status: "error",
        message: "Something went wrong",
    });
};
/**
 * ===============================
 * GLOBAL ERROR HANDLER
 * ===============================
 */
const errorHandler = (err, _req, res, _next) => {
    let error;
    /**
     * Default fallback
     */
    if (err instanceof AppError) {
        error = err;
    }
    /**
     * Mongo Duplicate
     */
    else if (isMongoDuplicateError(err)) {
        const field = err.keyValue && Object.keys(err.keyValue).length > 0
            ? Object.keys(err.keyValue)[0]
            : "Field";
        error = new AppError(`${field} already exists`, 400);
    }
    /**
     * Mongo Validation
     */
    else if (isMongoValidationError(err)) {
        const messages = Object.values(err.errors).map((e) => e.message);
        error = new AppError(messages.join(", "), 400);
    }
    /**
     * JWT Errors
     */
    else if (isJWTError(err)) {
        error =
            err.name === "TokenExpiredError"
                ? new AppError("Token expired, please login again", 401)
                : new AppError("Invalid token, please login again", 401);
    }
    /**
     * Unknown Error
     */
    else {
        error = new AppError("Internal Server Error", 500);
    }
    /**
     * ENV BASED RESPONSE
     */
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(error, res);
    }
    else {
        sendErrorProd(error, res);
    }
};
exports.errorHandler = errorHandler;
