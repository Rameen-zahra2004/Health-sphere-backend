export interface ErrorWithMessage {
  message: string;
}

export interface ErrorWithCode extends ErrorWithMessage {
  code?: number;
  name?: string;
  stack?: string;
}

export interface MongoDuplicateKeyError extends ErrorWithCode {
  code: 11000;
  keyValue: Record<string, unknown>;
}

export interface MongooseValidationIssue {
  message: string;
}

export interface MongooseValidationError extends ErrorWithCode {
  name: "ValidationError";
  errors: Record<string, MongooseValidationIssue>;
}

export interface JwtNamedError extends ErrorWithCode {
  name: "JsonWebTokenError" | "TokenExpiredError";
}

export const isErrorWithMessage = (value: unknown): value is ErrorWithMessage =>
  typeof value === "object" &&
  value !== null &&
  "message" in value &&
  typeof (value as { message: unknown }).message === "string";

export const toErrorMessage = (
  value: unknown,
  fallback = "Server Error",
): string => {
  if (isErrorWithMessage(value)) {
    return value.message;
  }
  return fallback;
};

export const isMongoDuplicateKeyError = (
  value: unknown,
): value is MongoDuplicateKeyError =>
  typeof value === "object" &&
  value !== null &&
  "code" in value &&
  (value as { code?: unknown }).code === 11000 &&
  "keyValue" in value &&
  typeof (value as { keyValue?: unknown }).keyValue === "object" &&
  (value as { keyValue?: unknown }).keyValue !== null;

export const isMongooseValidationError = (
  value: unknown,
): value is MongooseValidationError =>
  typeof value === "object" &&
  value !== null &&
  "name" in value &&
  (value as { name?: unknown }).name === "ValidationError" &&
  "errors" in value &&
  typeof (value as { errors?: unknown }).errors === "object" &&
  (value as { errors?: unknown }).errors !== null;

export const isJwtNamedError = (value: unknown): value is JwtNamedError =>
  typeof value === "object" &&
  value !== null &&
  "name" in value &&
  ((value as { name?: unknown }).name === "JsonWebTokenError" ||
    (value as { name?: unknown }).name === "TokenExpiredError");
