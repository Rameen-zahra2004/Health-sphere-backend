"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHelmetMiddleware = void 0;
const helmet_1 = __importDefault(require("helmet"));
const productionHelmetOptions = {
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
const developmentHelmetOptions = {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false, // ✅ can be false in dev
    crossOriginResourcePolicy: { policy: "cross-origin" },
    hidePoweredBy: true,
    hsts: false,
    noSniff: true,
};
const getHelmetMiddleware = () => {
    const isProduction = process.env.NODE_ENV === "production";
    return (0, helmet_1.default)(isProduction ? productionHelmetOptions : developmentHelmetOptions);
};
exports.getHelmetMiddleware = getHelmetMiddleware;
exports.default = productionHelmetOptions;
