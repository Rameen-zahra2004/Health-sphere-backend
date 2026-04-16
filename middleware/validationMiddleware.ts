
import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/* ================= ERROR FORMATTER ================= */
const formatErrors = (issues: ZodError["issues"]) =>
  issues.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));

/* ================= BODY VALIDATION ================= */
export const validateBody =
  <T>(schema: ZodSchema<T>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req.body);

      req.validatedBody = parsed;

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: formatErrors(err.issues),
        });
      }
      next(err);
    }
  };

/* ================= PARAMS VALIDATION ================= */
export const validateParams =
  <T>(schema: ZodSchema<T>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req.params);

      req.validatedParams = parsed;

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Params validation error",
          errors: formatErrors(err.issues),
        });
      }
      next(err);
    }
  };

/* ================= QUERY VALIDATION ================= */
export const validateQuery =
  <T>(schema: ZodSchema<T>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req.query);

      req.validatedQuery = parsed;

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Query validation error",
          errors: formatErrors(err.issues),
        });
      }
      next(err);
    }
  };