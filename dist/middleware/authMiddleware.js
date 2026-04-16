"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const protect = async (req, res, next) => {
    console.log("\n========== AUTH DEBUG START ==========");
    // ✅ 1. Log headers
    console.log("AUTH HEADER RECEIVED:", req.headers.authorization);
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        console.log("❌ Missing or invalid Bearer token");
        res.status(401).json({
            success: false,
            message: "Not authorized, token missing",
        });
        return;
    }
    const token = authHeader.split(" ")[1];
    console.log("🔑 TOKEN RECEIVED:", token);
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.log("❌ JWT_SECRET missing in env");
        res.status(500).json({
            success: false,
            message: "Server misconfiguration",
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        console.log("✅ DECODED TOKEN:", decoded);
        const user = await User_1.default.findById(decoded.id).select("_id role");
        console.log("👤 USER FROM DB:", user);
        if (!user) {
            console.log("❌ User not found in DB");
            res.status(401).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        req.user = {
            id: user._id.toString(),
            role: user.role,
        };
        console.log("✅ AUTH SUCCESS:", req.user);
        console.log("========== AUTH DEBUG END ==========\n");
        next();
    }
    catch (err) {
        console.log("❌ JWT ERROR:", err);
        res.status(401).json({
            success: false,
            message: "Not authorized, token invalid or expired",
        });
    }
};
exports.protect = protect;
