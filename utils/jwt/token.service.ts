// utils/jwt/token.service.ts

import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import { jwtConfig } from "./jwtConfig";
import { TokenPayload, DecodedToken } from "./token.types";

type ExpiresIn = SignOptions["expiresIn"];

class TokenService {
  private static ensureSecrets() {
    if (!jwtConfig.accessSecret) {
      throw new Error("JWT_SECRET is not defined");
    }
    if (!jwtConfig.refreshSecret) {
      throw new Error("JWT_REFRESH_SECRET is not defined");
    }
  }

  static generateAccessToken(
    payload: TokenPayload,
    expiresIn: ExpiresIn = jwtConfig.accessExpiry
  ): string {
    this.ensureSecrets();

    return jwt.sign(payload, jwtConfig.accessSecret, {
      expiresIn,
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    });
  }

  static generateRefreshToken(
    payload: TokenPayload,
    expiresIn: ExpiresIn = jwtConfig.refreshExpiry
  ): string {
    this.ensureSecrets();

    return jwt.sign(payload, jwtConfig.refreshSecret, {
      expiresIn,
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    });
  }

  static verifyAccessToken(token: string): DecodedToken {
    this.ensureSecrets();

    return jwt.verify(token, jwtConfig.accessSecret, {
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    }) as DecodedToken;
  }

  static verifyRefreshToken(token: string): DecodedToken {
    this.ensureSecrets();

    return jwt.verify(token, jwtConfig.refreshSecret, {
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    }) as DecodedToken;
  }

  static decodeToken(token: string): DecodedToken | null {
    return jwt.decode(token) as DecodedToken | null;
  }
}

export default TokenService;