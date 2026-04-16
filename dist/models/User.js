"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
/* ================= SCHEMA ================= */
const UserSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ["patient", "doctor", "admin"],
        default: "patient",
        index: true,
    },
    phone: {
        type: String,
        default: "",
    },
    department: {
        type: String,
        default: "",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    refreshToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerificationToken: String,
}, {
    timestamps: true,
});
/* ================= PASSWORD HASH ================= */
UserSchema.pre("save", async function () {
    if (!this.isModified("password"))
        return;
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
});
/* ================= METHODS ================= */
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return bcryptjs_1.default.compare(enteredPassword, this.password);
};
UserSchema.methods.getSignedJwtToken = function () {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jsonwebtoken_1.default.sign({
        id: this._id.toString(),
        role: this.role,
    }, process.env.JWT_SECRET, { expiresIn: "15m" });
};
UserSchema.methods.getRefreshToken = function () {
    const token = crypto_1.default.randomBytes(40).toString("hex");
    this.refreshToken = token;
    return token;
};
UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto_1.default.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
    return resetToken;
};
/* ================= EXPORT ================= */
const User = mongoose_1.default.models.User ||
    mongoose_1.default.model("User", UserSchema);
exports.default = User;
