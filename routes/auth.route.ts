
import { Router } from "express";

/**
 * Controllers
 */
import {
  register,
  login,
  logout,
  getMe,
  refreshToken,
  forgotPassword,
  resetPassword,
  updatePassword,
  verifyEmail,
} from "../controllers/auth.controller";

/**
 * Middlewares
 */
import { protect } from "../middleware/authMiddleware";
import {
  validateBody,
  validateParams,
} from "../middleware/validationMiddleware";

import { asyncHandler } from "../utils/asyncHandler";

/**
 * Validators
 */
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updatePasswordSchema,
} from "../validators/authValidator";

/**
 * Rate Limiters
 */
import {
  authLimiter,
  passwordResetLimiter,
} from "../config/rateLimiter";

const router = Router();

/* =========================
   PUBLIC ROUTES
========================= */

router.post(
  "/register",
  authLimiter,
  validateBody(registerSchema),
  asyncHandler(register)
);

router.post(
  "/login",
  authLimiter,
  validateBody(loginSchema),
  asyncHandler(login)
);

router.post(
  "/refresh-token",
  asyncHandler(refreshToken)
);

router.post(
  "/forgot-password",
  passwordResetLimiter,
  validateBody(forgotPasswordSchema),
  asyncHandler(forgotPassword)
);

/* =========================
   PARAM ROUTE (RESET TOKEN)
========================= */

router.put(
  "/reset-password/:resetToken",
  passwordResetLimiter,
  validateParams(resetPasswordSchema),
  asyncHandler(resetPassword)
);

router.get(
  "/verify-email/:verificationToken",
  asyncHandler(verifyEmail)
);

/* =========================
   PROTECTED ROUTES
========================= */

router.use(protect);

/* =========================
   AUTH PROTECTED ROUTES
========================= */

router.post(
  "/logout",
  asyncHandler(logout)
);

router.get(
  "/me",
  asyncHandler(getMe)
);

router.put(
  "/update-password",
  validateBody(updatePasswordSchema),
  asyncHandler(updatePassword)
);

export default router;