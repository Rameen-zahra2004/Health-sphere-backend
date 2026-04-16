
// import express, { Application, Request, Response } from "express";
// import path from "path";
// import dotenv from "dotenv";

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
import express, { Application, Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";

// =============================
// ENV CONFIG
// =============================
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import connectDB from "./config/db.js";
import { config, middleware } from "./config/index.js";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

/* =============================
   APP INIT
============================= */
const app: Application = express();

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
app.use((req: Request, _res: Response, next) => {
  console.log(`📩 ${req.method} ${req.url}`);
  next();
});

/* =============================
   SECURITY + MIDDLEWARE
============================= */
app.use(middleware.helmet);
app.use(middleware.cors);
app.use(middleware.morgan);

/* =============================
   BODY PARSER
============================= */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* =============================
   RATE LIMIT
============================= */
app.use("/api", middleware.rateLimiters.general);

/* =============================
   HEALTH CHECK
============================= */
app.get("/health", (_req: Request, res: Response) => {
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
app.use("/api", routes);

/* =============================
   ERROR HANDLING
============================= */
app.use(notFound);
app.use(errorHandler);

/* =============================
   START SERVER
============================= */
const startServer = async (): Promise<void> => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await connectDB();

    const PORT = process.env.PORT || config.port || 4000;

    const server = app.listen(PORT, () => {
      console.log("\n🚀 SERVER STARTED");
      console.log(`📡 PORT: ${PORT}`);
      console.log(`🌍 ENV: ${process.env.NODE_ENV || "development"}`);
      console.log(`🌐 CLIENT: ${config.clientUrl}\n`);
    });

    /* =============================
       GRACEFUL SHUTDOWN
    ============================= */
    const shutdown = (signal: string) => {
      console.log(`⚠️ ${signal} received. Shutting down...`);

      server.close(() => {
        console.log("✅ Server closed cleanly");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error(
      "❌ FAILED TO START SERVER:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
};

startServer();