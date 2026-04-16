import { AppError } from "./AppError";

/**
 * Safely extracts a route param as string
 */
export const getSafeParam = (param: string | string[] | undefined, name = "param"): string => {
  if (!param || Array.isArray(param)) {
    throw new AppError(`Invalid ${name}`, 400);
  }

  return param;
};