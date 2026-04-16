"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSafeParam = void 0;
const AppError_1 = require("./AppError");
/**
 * Safely extracts a route param as string
 */
const getSafeParam = (param, name = "param") => {
    if (!param || Array.isArray(param)) {
        throw new AppError_1.AppError(`Invalid ${name}`, 400);
    }
    return param;
};
exports.getSafeParam = getSafeParam;
