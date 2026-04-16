"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.refreshToken = exports.logout = exports.getMe = exports.login = exports.register = void 0;
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const patient_1 = __importDefault(require("../models/patient"));
const auth_utils_1 = require("../utils/auth.utils");
/* ================= SAFE RESPONSE ================= */
const sendAuthResponse = async (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const refreshToken = user.getRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    res.status(statusCode).json({
        user: {
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
        },
        token,
    });
};
/* ================= REGISTER ================= */
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        const cleanFirstName = firstName?.trim();
        const cleanLastName = lastName?.trim();
        const cleanEmail = email?.trim().toLowerCase();
        const cleanPassword = password;
        if (!cleanFirstName || !cleanLastName || !cleanEmail || !cleanPassword) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const existingUser = await User_1.default.findOne({ email: cleanEmail });
        if (existingUser) {
            res.status(409).json({ message: "User already exists" });
            return;
        }
        const user = await User_1.default.create({
            firstName: cleanFirstName,
            lastName: cleanLastName,
            email: cleanEmail,
            password: cleanPassword,
            role: role ?? "patient",
        });
        // SAFE PATIENT CREATION
        if (user.role === "patient") {
            try {
                const exists = await patient_1.default.findOne({ userId: user._id });
                if (!exists) {
                    await patient_1.default.create({
                        userId: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                    });
                }
            }
            catch (err) {
                console.error("Patient creation failed (ignored):", err);
            }
        }
        await sendAuthResponse(user, 201, res);
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};
exports.register = register;
/* ================= LOGIN ================= */
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "Email & password required" });
        return;
    }
    const user = await User_1.default.findOne({ email }).select("+password");
    if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    await sendAuthResponse(user, 200, res);
};
exports.login = login;
/* ================= GET ME ================= */
const getMe = async (req, res) => {
    if (!req.user?.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const user = await User_1.default.findById(req.user.id).select("-password");
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json({ user });
};
exports.getMe = getMe;
/* ================= LOGOUT ================= */
const logout = async (_req, res) => {
    res.json({ message: "Logged out successfully" });
};
exports.logout = logout;
/* ================= REFRESH TOKEN ================= */
const refreshToken = async (req, res) => {
    const token = req.cookies?.refreshToken;
    if (!token) {
        res.status(401).json({ message: "No refresh token" });
        return;
    }
    const user = await User_1.default.findOne({ refreshToken: token });
    if (!user) {
        res.status(401).json({ message: "Invalid refresh token" });
        return;
    }
    const newToken = auth_utils_1.AuthUtils.generateAccessToken({
        id: user._id,
        role: user.role,
    });
    res.json({ token: newToken });
};
exports.refreshToken = refreshToken;
/* ================= FORGOT PASSWORD ================= */
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User_1.default.findOne({ email });
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    res.json({
        message: "Reset link generated",
        resetToken,
    });
};
exports.forgotPassword = forgotPassword;
/* ================= RESET PASSWORD ================= */
const resetPassword = async (req, res) => {
    try {
        const resetToken = req.params.resetToken;
        if (!resetToken || Array.isArray(resetToken)) {
            res.status(400).json({ message: "Invalid token" });
            return;
        }
        const hashedToken = crypto_1.default
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        const user = await User_1.default.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!user) {
            res.status(400).json({ message: "Invalid or expired token" });
            return;
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        await sendAuthResponse(user, 200, res);
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};
exports.resetPassword = resetPassword;
/* ================= UPDATE PASSWORD (FIXED) ================= */
const updatePassword = async (req, res) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const user = await User_1.default.findById(req.user.id).select("+password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const { currentPassword, newPassword } = req.body;
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            res.status(401).json({ message: "Incorrect password" });
            return;
        }
        user.password = newPassword;
        await user.save();
        await sendAuthResponse(user, 200, res);
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};
exports.updatePassword = updatePassword;
/* ================= VERIFY EMAIL (FIXED) ================= */
const verifyEmail = async (req, res) => {
    try {
        const { verificationToken } = req.params;
        const user = await User_1.default.findOne({
            emailVerificationToken: verificationToken,
        });
        if (!user) {
            res.status(400).json({ message: "Invalid token" });
            return;
        }
        user.isVerified = true;
        user.emailVerificationToken = undefined;
        await user.save();
        res.json({ message: "Email verified successfully" });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};
exports.verifyEmail = verifyEmail;
