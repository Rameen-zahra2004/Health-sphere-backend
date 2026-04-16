"use strict";
// utils/jwt/jwt.config.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
exports.jwtConfig = {
    accessSecret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiry: "15m",
    refreshExpiry: "7d",
    issuer: "app-api",
    audience: "app-users",
};
