import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

/* ===============================
   Custom App Error Class
=============================== */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/* ===============================
   TYPE GUARDS (STRICT)
=============================== */

// Mongo duplicate key error
interface MongoDuplicateError {
  code: number;
  keyValue: Record<string, unknown>;
}

// Mongoose validation error
interface MongooseValidationError extends Error {
  errors: Record<string, { message: string }>;
}

const isMongoDuplicateError = (err: unknown): err is MongoDuplicateError => {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: unknown }).code === 11000 &&
    "keyValue" in err
  );
};

const isMongooseValidationError = (
  err: unknown
): err is MongooseValidationError => {
  return (
    err instanceof Error &&
    err.name === "ValidationError" &&
    "errors" in err
  );
};

/* ===============================
   Global Error Handler
=============================== */
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
 
): void => {
  let error: AppError;

  /* ===============================
     Normalize Error
  =============================== */
  if (err instanceof AppError) {
    error = err;
  } else if (err instanceof Error) {
    error = new AppError(err.message);
  } else {
    error = new AppError("Unknown error occurred");
  }

  /* ===============================
     Logging
  =============================== */
  logger.error("API Error", {
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

/* ===============================
   404 Middleware
=============================== */
export const notFound = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(new AppError(`Not Found - ${req.originalUrl}`, 404));
};