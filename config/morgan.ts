
// backend/config/morgan.ts

import morgan, { StreamOptions, TokenIndexer } from "morgan";
import type { Request, Response } from "express";

/**
 * ===============================
 * Constants
 * ===============================
 */

const isProduction = process.env.NODE_ENV === "production";

/**
 * ===============================
 * Custom Morgan Tokens
 * ===============================
 */

// Colored status code
morgan.token("status-colored", (_req: Request, res: Response): string => {
  const status = res.statusCode;

  if (status >= 500) return `\x1b[31m${status}\x1b[0m`; // red
  if (status >= 400) return `\x1b[33m${status}\x1b[0m`; // yellow
  if (status >= 300) return `\x1b[36m${status}\x1b[0m`; // cyan
  if (status >= 200) return `\x1b[32m${status}\x1b[0m`; // green

  return `${status}`;
});

// Colored response time (NO any usage)
morgan.token("response-time-colored", (req: Request, res: Response): string => {
  const tokens = morgan as unknown as TokenIndexer<Request, Response>;

  const timeStr = tokens["response-time"](req, res) ?? "";
  const time = Number.parseFloat(timeStr);

  if (Number.isNaN(time)) return "";

  if (time < 100) return `\x1b[32m${time}ms\x1b[0m`;
  if (time < 500) return `\x1b[33m${time}ms\x1b[0m`;

  return `\x1b[31m${time}ms\x1b[0m`;
});

// Request body (safe logging)
morgan.token("body", (req: Request): string => {
  if (isProduction) return "";

  // Avoid logging sensitive routes
  if (req.path.includes("/auth")) return "";

  try {
    return req.body && Object.keys(req.body).length > 0
      ? JSON.stringify(req.body)
      : "";
  } catch {
    return "";
  }
});

/**
 * ===============================
 * Log Formats
 * ===============================
 */

const developmentFormat = [
  "\x1b[35m:method\x1b[0m",
  "\x1b[36m:url\x1b[0m",
  ":status-colored",
  ":response-time-colored",
  "\x1b[90m- :res[content-length]\x1b[0m",
  ":body",
].join(" ");

const productionFormat = "combined";
const testFormat = "tiny";

/**
 * ===============================
 * Stream (Production-safe)
 * ===============================
 */

export const stream: StreamOptions = {
  write: (message: string): void => {
    // In real production, replace with Winston/Pino
    console.log(message.trim());
  },
};

/**
 * ===============================
 * Skip Logic
 * ===============================
 */

const skipHealthCheck = (req: Request): boolean => {
  return req.path === "/" || req.path === "/health";
};

/**
 * ===============================
 * Middleware Factory
 * ===============================
 */

export const getMorganMiddleware = () => {
  const env = process.env.NODE_ENV ?? "development";

  if (env === "production") {
    return morgan(productionFormat, { stream });
  }

  if (env === "test") {
    return morgan(testFormat, { stream });
  }

  return morgan(developmentFormat, {
    stream,
    skip: (req: Request) => skipHealthCheck(req),
  });
};

/**
 * ===============================
 * Error Logger (status >= 400)
 * ===============================
 */

export const getMorganErrorOnly = () =>
  morgan(developmentFormat, {
    stream,
    skip: (_req: Request, res: Response) => res.statusCode < 400,
  });

/**
 * ===============================
 * Custom Skip Middleware
 * ===============================
 */

export const getMorganWithSkip = (
  skipFn: (req: Request, res: Response) => boolean
) =>
  morgan(developmentFormat, {
    stream,
    skip: (req: Request, res: Response) => skipFn(req, res),
  });

export default getMorganMiddleware;