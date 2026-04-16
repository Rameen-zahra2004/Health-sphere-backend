import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: string;
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m",
    issuer: "app",
  });
};

export const generateRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
    issuer: "app",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};