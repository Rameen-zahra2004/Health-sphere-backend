import { Request } from "express";
import { Document, Types } from "mongoose";
import { Response, NextFunction } from "express";

/**
 * =========================
 * USER ROLES
 * =========================
 */
export type UserRole =
  | "admin"
  | "doctor"
  | "receptionist";

/**
 * =========================
 * MONGOOSE USER
 * =========================
 */
export interface IUser extends Document {
  _id: Types.ObjectId;

  firstName: string;
  lastName: string;
  username?: string;

  email: string;
  password: string;

  role: UserRole;

  phone?: string;
  department?: string;
  isActive?: boolean;
  avatar?: string;

  createdAt?: Date;
  updatedAt?: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
}

/**
 * =========================
 * AUTH USER (JWT PAYLOAD)
 * =========================
 */
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
}

/**
 * =========================
 * EXPRESS AUTH REQUEST
 * =========================
 */
export interface AuthRequest extends Request {
  user?: AuthUser;
}

/**
 * =========================
 * ASYNC CONTROLLER TYPE
 * =========================
 */
export type AsyncController = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<void> | void;