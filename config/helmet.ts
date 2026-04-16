
import helmet, { HelmetOptions } from "helmet";

const productionHelmetOptions: HelmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: { policy: "same-origin" }, // ✅ Must be object
  crossOriginResourcePolicy: { policy: "cross-origin" },
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: { permittedPolicies: "none" },
  referrerPolicy: { policy: "no-referrer" },
};

const developmentHelmetOptions: HelmetOptions = {
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false, // ✅ can be false in dev
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hidePoweredBy: true,
  hsts: false,
  noSniff: true,
};

export const getHelmetMiddleware = () => {
  const isProduction = process.env.NODE_ENV === "production";
  return helmet(isProduction ? productionHelmetOptions : developmentHelmetOptions);
};

export default productionHelmetOptions;