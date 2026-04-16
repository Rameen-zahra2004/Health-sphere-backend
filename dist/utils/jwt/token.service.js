"use strict";
// utils/jwt/token.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtConfig_1 = require("./jwtConfig");
class TokenService {
    static ensureSecrets() {
        if (!jwtConfig_1.jwtConfig.accessSecret) {
            throw new Error("JWT_SECRET is not defined");
        }
        if (!jwtConfig_1.jwtConfig.refreshSecret) {
            throw new Error("JWT_REFRESH_SECRET is not defined");
        }
    }
    static generateAccessToken(payload, expiresIn = jwtConfig_1.jwtConfig.accessExpiry) {
        this.ensureSecrets();
        return jsonwebtoken_1.default.sign(payload, jwtConfig_1.jwtConfig.accessSecret, {
            expiresIn,
            issuer: jwtConfig_1.jwtConfig.issuer,
            audience: jwtConfig_1.jwtConfig.audience,
        });
    }
    static generateRefreshToken(payload, expiresIn = jwtConfig_1.jwtConfig.refreshExpiry) {
        this.ensureSecrets();
        return jsonwebtoken_1.default.sign(payload, jwtConfig_1.jwtConfig.refreshSecret, {
            expiresIn,
            issuer: jwtConfig_1.jwtConfig.issuer,
            audience: jwtConfig_1.jwtConfig.audience,
        });
    }
    static verifyAccessToken(token) {
        this.ensureSecrets();
        return jsonwebtoken_1.default.verify(token, jwtConfig_1.jwtConfig.accessSecret, {
            issuer: jwtConfig_1.jwtConfig.issuer,
            audience: jwtConfig_1.jwtConfig.audience,
        });
    }
    static verifyRefreshToken(token) {
        this.ensureSecrets();
        return jsonwebtoken_1.default.verify(token, jwtConfig_1.jwtConfig.refreshSecret, {
            issuer: jwtConfig_1.jwtConfig.issuer,
            audience: jwtConfig_1.jwtConfig.audience,
        });
    }
    static decodeToken(token) {
        return jsonwebtoken_1.default.decode(token);
    }
}
exports.default = TokenService;
