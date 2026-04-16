import { Request } from "express";

/* ================= USER ================= */
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "doctor" | "patient" | "receptionist";
}

/* ================= AUTH REQUEST (FIXED) ================= */
export interface AuthRequest extends Request {
  user?: User;
}

/* ================= AUTH RESPONSE ================= */
export interface AuthResponse {
  user: User;
  token: string;
}

/* ================= LOGIN ================= */
export interface LoginCredentials {
  email: string;
  password: string;
}

/* ================= REGISTER ================= */
export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}