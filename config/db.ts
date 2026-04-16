
// backend/config/db.ts

import mongoose from "mongoose";
import { config } from "./index.js";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = config.mongoUri;

    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined");
    }

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`❌ MongoDB error: ${error.message}`);
    } else {
      console.error("❌ Unknown MongoDB error");
    }

    throw error;
  }
};

// Events
mongoose.connection.on("connected", () => {
  console.log("📡 Mongoose connected");
});

mongoose.connection.on("error", (err: unknown) => {
  console.error("❌ Mongoose error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ Mongoose disconnected");
});

// Retry logic
const connectWithRetry = async (retries = 5): Promise<void> => {
  try {
    await connectDB();
  } catch {
    if (retries === 0) {
      console.error("❌ All retries failed");
      process.exit(1);
    }

    console.log(`🔁 Retrying DB... (${retries})`);
    setTimeout(() => connectWithRetry(retries - 1), 5000);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`⚠️ ${signal} received. Closing DB...`);
  await mongoose.connection.close();
  console.log("🔌 DB closed");
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

export default connectWithRetry;