import jwt from "jsonwebtoken";

export class AuthUtils {
  static generateAccessToken(payload: object) {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
      expiresIn: "15m",
    });
  }

  static generateRefreshToken(payload: object) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: "7d",
    });
  }

  static cookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
    };
  }
}