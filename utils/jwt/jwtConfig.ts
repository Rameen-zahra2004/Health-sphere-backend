// utils/jwt/jwt.config.ts

import type { SignOptions } from "jsonwebtoken";

export const jwtConfig = {
  accessSecret: process.env.JWT_SECRET as string,
  refreshSecret: process.env.JWT_REFRESH_SECRET as string,

  accessExpiry: "15m" as SignOptions["expiresIn"],
  refreshExpiry: "7d" as SignOptions["expiresIn"],

  issuer: "app-api",
  audience: "app-users",
};