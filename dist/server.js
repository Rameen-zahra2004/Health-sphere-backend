"use strict";
// import express, { Application, Request, Response } from "express";
// import path from "path";
// import dotenv from "dotenv";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// // Load env FIRST
// dotenv.config({ path: path.resolve(process.cwd(), ".env") });
// import connectDB from "./config/db.js";
// import { config, middleware } from "./config/index.js";
// import routes from "./routes/index.js";
// import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
// /* =============================
//    APP INIT
// ============================= */
// const app: Application = express();
// /* =============================
//    ENV DEBUG (SAFE)
// ============================= */
// console.log("🔎 ENV CHECK:", {
//   NODE_ENV: process.env.NODE_ENV,
//   PORT: process.env.PORT,
//   MONGO_URI: process.env.MONGO_URI ? "SET" : "NOT SET",
// });
// /* =============================
//    GLOBAL REQUEST LOGGER (IMPORTANT)
//    👉 THIS CONFIRMS REQUEST REACHES BACKEND
// ============================= */
// app.use((req: Request, _res: Response, next) => {
//   console.log(`📩 REQUEST => ${req.method} ${req.url}`);
//   next();
// });
// /* =============================
//    SECURITY MIDDLEWARE
// ============================= */
// app.use(middleware.helmet);
// app.use(middleware.cors);
// /* =============================
//    BODY PARSERS
// ============================= */
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true }));
// /* =============================
//    LOGGING
// ============================= */
// app.use(middleware.morgan);
// /* =============================
//    RATE LIMITING
// ============================= */
// app.use("/api", middleware.rateLimiters.general);
// /* =============================
//    HEALTH CHECK
// ============================= */
// app.get("/health", (_req: Request, res: Response) => {
//   res.status(200).json({
//     success: true,
//     message: "Health Sphere API running 🚀",
//     uptime: process.uptime(),
//     timestamp: new Date().toISOString(),
//   });
// });
// /* =============================
//    MAIN ROUTES
// ============================= */
// app.use("/api", routes);
// /* =============================
//    404 HANDLER
// ============================= */
// app.use(notFound);
// /* =============================
//    GLOBAL ERROR HANDLER
// ============================= */
// app.use(errorHandler);
// /* =============================
//    START SERVER
// ============================= */
// const startServer = async (): Promise<void> => {
//   try {
//     await connectDB();
//     const PORT = config.port || 4000;
//     const server = app.listen(PORT, () => {
//       console.log("\n🚀 SERVER STARTED");
//       console.log(`📡 PORT: ${PORT}`);
//       console.log(`🌍 ENV: ${config.nodeEnv}`);
//       console.log(`🌐 CLIENT: ${config.clientUrl}\n`);
//     });
//     server.on("error", (err: Error) => {
//       console.error("❌ SERVER ERROR:", err.message);
//       process.exit(1);
//     });
//     /* =============================
//        GRACEFUL SHUTDOWN
//     ============================= */
//     const shutdown = (signal: string) => {
//       console.log(`⚠️ ${signal} received. Shutting down...`);
//       server.close(() => {
//         console.log("✅ Server closed cleanly");
//         process.exit(0);
//       });
//     };
//     process.on("SIGINT", () => shutdown("SIGINT"));
//     process.on("SIGTERM", () => shutdown("SIGTERM"));
//   } catch (error) {
//     console.error(
//       "❌ FAILED TO START SERVER:",
//       error instanceof Error ? error.message : error
//     );
//     process.exit(1);
//   }
// };
// startServer();
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// =============================
// ENV CONFIG
// =============================
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env") });
const db_js_1 = __importDefault(require("./config/db.js"));
const index_js_1 = require("./config/index.js");
const index_js_2 = __importDefault(require("./routes/index.js"));
const errorMiddleware_js_1 = require("./middleware/errorMiddleware.js");
/* =============================
   APP INIT
============================= */
const app = (0, express_1.default)();
/* =============================
   SAFE ENV CHECK
============================= */
console.log("🔎 ENV CHECK:", {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI ? "SET" : "NOT SET",
});
/* =============================
   REQUEST LOGGER
============================= */
app.use((req, _res, next) => {
    console.log(`📩 ${req.method} ${req.url}`);
    next();
});
/* =============================
   SECURITY + MIDDLEWARE
============================= */
app.use(index_js_1.middleware.helmet);
app.use(index_js_1.middleware.cors);
app.use(index_js_1.middleware.morgan);
/* =============================
   BODY PARSER
============================= */
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
/* =============================
   RATE LIMIT
============================= */
app.use("/api", index_js_1.middleware.rateLimiters.general);
/* =============================
   HEALTH CHECK
============================= */
app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Health Sphere API is running 🚀",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});
/* =============================
   MAIN ROUTES
============================= */
app.use("/api", index_js_2.default);
/* =============================
   ERROR HANDLING
============================= */
app.use(errorMiddleware_js_1.notFound);
app.use(errorMiddleware_js_1.errorHandler);
/* =============================
   START SERVER
============================= */
const startServer = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        await (0, db_js_1.default)();
        const PORT = process.env.PORT || index_js_1.config.port || 4000;
        const server = app.listen(PORT, () => {
            console.log("\n🚀 SERVER STARTED");
            console.log(`📡 PORT: ${PORT}`);
            console.log(`🌍 ENV: ${process.env.NODE_ENV || "development"}`);
            console.log(`🌐 CLIENT: ${index_js_1.config.clientUrl}\n`);
        });
        /* =============================
           GRACEFUL SHUTDOWN
        ============================= */
        const shutdown = (signal) => {
            console.log(`⚠️ ${signal} received. Shutting down...`);
            server.close(() => {
                console.log("✅ Server closed cleanly");
                process.exit(0);
            });
        };
        process.on("SIGINT", () => shutdown("SIGINT"));
        process.on("SIGTERM", () => shutdown("SIGTERM"));
    }
    catch (error) {
        console.error("❌ FAILED TO START SERVER:", error instanceof Error ? error.message : error);
        process.exit(1);
    }
};
startServer();
