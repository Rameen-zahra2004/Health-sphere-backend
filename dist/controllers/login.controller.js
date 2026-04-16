"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const AppError_1 = require("../utils/AppError");
const auth_utils_1 = require("../utils/auth.utils");
const User_1 = __importDefault(require("../models/User"));
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    /* =========================
       VALIDATION
    ========================= */
    if (!email || !password) {
        throw new AppError_1.AppError("Email and password are required", 400);
    }
    /* =========================
       FIND USER (include password)
    ========================= */
    const user = await User_1.default.findOne({ email }).select("+password");
    if (!user) {
        throw new AppError_1.AppError("Invalid credentials", 401);
    }
    /* =========================
       CHECK PASSWORD
    ========================= */
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new AppError_1.AppError("Invalid credentials", 401);
    }
    /* =========================
       GENERATE TOKEN
    ========================= */
    const token = auth_utils_1.AuthUtils.generateAccessToken({
        id: user._id,
        role: user.role,
    });
    /* =========================
       SAFE USER RESPONSE (NO DELETE ❌)
    ========================= */
    const { password: _, ...safeUser } = user.toObject();
    /* =========================
       RESPONSE
    ========================= */
    res.status(200).json({
        success: true,
        token,
        user: safeUser,
    });
});
