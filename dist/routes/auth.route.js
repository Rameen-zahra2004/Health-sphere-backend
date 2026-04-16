"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
/**
 * Controllers
 */
const auth_controller_1 = require("../controllers/auth.controller");
/**
 * Middlewares
 */
const authMiddleware_1 = require("../middleware/authMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const asyncHandler_1 = require("../utils/asyncHandler");
/**
 * Validators
 */
const authValidator_1 = require("../validators/authValidator");
/**
 * Rate Limiters
 */
const rateLimiter_1 = require("../config/rateLimiter");
const router = (0, express_1.Router)();
/* =========================
   PUBLIC ROUTES
========================= */
router.post("/register", rateLimiter_1.authLimiter, (0, validationMiddleware_1.validateBody)(authValidator_1.registerSchema), (0, asyncHandler_1.asyncHandler)(auth_controller_1.register));
router.post("/login", rateLimiter_1.authLimiter, (0, validationMiddleware_1.validateBody)(authValidator_1.loginSchema), (0, asyncHandler_1.asyncHandler)(auth_controller_1.login));
router.post("/refresh-token", (0, asyncHandler_1.asyncHandler)(auth_controller_1.refreshToken));
router.post("/forgot-password", rateLimiter_1.passwordResetLimiter, (0, validationMiddleware_1.validateBody)(authValidator_1.forgotPasswordSchema), (0, asyncHandler_1.asyncHandler)(auth_controller_1.forgotPassword));
/* =========================
   PARAM ROUTE (RESET TOKEN)
========================= */
router.put("/reset-password/:resetToken", rateLimiter_1.passwordResetLimiter, (0, validationMiddleware_1.validateParams)(authValidator_1.resetPasswordSchema), (0, asyncHandler_1.asyncHandler)(auth_controller_1.resetPassword));
router.get("/verify-email/:verificationToken", (0, asyncHandler_1.asyncHandler)(auth_controller_1.verifyEmail));
/* =========================
   PROTECTED ROUTES
========================= */
router.use(authMiddleware_1.protect);
/* =========================
   AUTH PROTECTED ROUTES
========================= */
router.post("/logout", (0, asyncHandler_1.asyncHandler)(auth_controller_1.logout));
router.get("/me", (0, asyncHandler_1.asyncHandler)(auth_controller_1.getMe));
router.put("/update-password", (0, validationMiddleware_1.validateBody)(authValidator_1.updatePasswordSchema), (0, asyncHandler_1.asyncHandler)(auth_controller_1.updatePassword));
exports.default = router;
