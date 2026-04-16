
import { Request, Response, NextFunction } from "express";

/**
 * ===============================
 * App Error Class
 * ===============================
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: "fail" | "error";
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.isOperational = true;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

/**
 * ===============================
 * STRICT TYPES
 * ===============================
 */
type MongoDuplicateError = {
  code: 11000;
  keyValue?: Record<string, unknown>;
};

type MongoValidationError = {
  name: "ValidationError";
  errors: Record<string, { message: string }>;
};

type JWTError = {
  name: "JsonWebTokenError" | "TokenExpiredError";
};

/**
 * ===============================
 * TYPE GUARDS
 * ===============================
 */
const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isMongoDuplicateError = (err: unknown): err is MongoDuplicateError => {
  return isObject(err) && err.code === 11000;
};

const isMongoValidationError = (err: unknown): err is MongoValidationError => {
  return (
    isObject(err) &&
    err.name === "ValidationError" &&
    isObject(err.errors)
  );
};

const isJWTError = (err: unknown): err is JWTError => {
  return (
    isObject(err) &&
    (err.name === "JsonWebTokenError" ||
      err.name === "TokenExpiredError")
  );
};

/**
 * ===============================
 * SEND ERROR (DEV)
 * ===============================
 */
const sendErrorDev = (err: AppError, res: Response) => {
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
const sendErrorProd = (err: AppError, res: Response) => {
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
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error: AppError;

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
    const field =
      err.keyValue && Object.keys(err.keyValue).length > 0
        ? Object.keys(err.keyValue)[0]
        : "Field";

    error = new AppError(`${field} already exists`, 400);
  }

  /**
   * Mongo Validation
   */
  else if (isMongoValidationError(err)) {
    const messages = Object.values(err.errors).map(
      (e) => e.message
    );

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
  } else {
    sendErrorProd(error, res);
  }
};