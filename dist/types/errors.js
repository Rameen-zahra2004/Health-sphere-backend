"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJwtNamedError = exports.isMongooseValidationError = exports.isMongoDuplicateKeyError = exports.toErrorMessage = exports.isErrorWithMessage = void 0;
const isErrorWithMessage = (value) => typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string";
exports.isErrorWithMessage = isErrorWithMessage;
const toErrorMessage = (value, fallback = "Server Error") => {
    if ((0, exports.isErrorWithMessage)(value)) {
        return value.message;
    }
    return fallback;
};
exports.toErrorMessage = toErrorMessage;
const isMongoDuplicateKeyError = (value) => typeof value === "object" &&
    value !== null &&
    "code" in value &&
    value.code === 11000 &&
    "keyValue" in value &&
    typeof value.keyValue === "object" &&
    value.keyValue !== null;
exports.isMongoDuplicateKeyError = isMongoDuplicateKeyError;
const isMongooseValidationError = (value) => typeof value === "object" &&
    value !== null &&
    "name" in value &&
    value.name === "ValidationError" &&
    "errors" in value &&
    typeof value.errors === "object" &&
    value.errors !== null;
exports.isMongooseValidationError = isMongooseValidationError;
const isJwtNamedError = (value) => typeof value === "object" &&
    value !== null &&
    "name" in value &&
    (value.name === "JsonWebTokenError" ||
        value.name === "TokenExpiredError");
exports.isJwtNamedError = isJwtNamedError;
