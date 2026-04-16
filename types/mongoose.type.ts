
import type { HydratedDocument, UpdateQuery, Types } from "mongoose";

/* ================= QUERY TYPES ================= */

/**
 * Safe generic filter type (Mongoose-compatible)
 * Works with all modern Mongoose versions
 */
export type MFilter<T> = Partial<Record<keyof T, any>>;

/**
 * Safe update type
 */
export type MUpdate<T> = UpdateQuery<T>;

/* ================= DOCUMENT ================= */

export type MDoc<T> = HydratedDocument<T>;

/* ================= OBJECT ID ================= */

export type ObjectId = Types.ObjectId | string;