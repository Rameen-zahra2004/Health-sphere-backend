"use strict";
// backend/config/db.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const index_js_1 = require("./index.js");
const connectDB = async () => {
    try {
        const mongoURI = index_js_1.config.mongoUri;
        if (!mongoURI) {
            throw new Error("MONGO_URI is not defined");
        }
        const conn = await mongoose_1.default.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`❌ MongoDB error: ${error.message}`);
        }
        else {
            console.error("❌ Unknown MongoDB error");
        }
        throw error;
    }
};
// Events
mongoose_1.default.connection.on("connected", () => {
    console.log("📡 Mongoose connected");
});
mongoose_1.default.connection.on("error", (err) => {
    console.error("❌ Mongoose error:", err);
});
mongoose_1.default.connection.on("disconnected", () => {
    console.warn("⚠️ Mongoose disconnected");
});
// Retry logic
const connectWithRetry = async (retries = 5) => {
    try {
        await connectDB();
    }
    catch {
        if (retries === 0) {
            console.error("❌ All retries failed");
            process.exit(1);
        }
        console.log(`🔁 Retrying DB... (${retries})`);
        setTimeout(() => connectWithRetry(retries - 1), 5000);
    }
};
// Graceful shutdown
const gracefulShutdown = async (signal) => {
    console.log(`⚠️ ${signal} received. Closing DB...`);
    await mongoose_1.default.connection.close();
    console.log("🔌 DB closed");
    process.exit(0);
};
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
exports.default = connectWithRetry;
