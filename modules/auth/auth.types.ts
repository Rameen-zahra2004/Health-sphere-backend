import type { HydratedDocument } from "mongoose";

/* ================= USER BASE TYPE ================= */
export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "patient" | "doctor" | "admin";
  isActive: boolean;
}

/* ================= MONGOOSE DOCUMENT ================= */
export type IUserDocument = HydratedDocument<IUser>;

/* ================= DTO ================= */
export interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: "patient" | "doctor" | "admin";
}