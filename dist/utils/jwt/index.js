"use strict";
// utils/jwt/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
const token_service_1 = __importDefault(require("./token.service"));
exports.default = token_service_1.default;
var jwtConfig_1 = require("./jwtConfig");
Object.defineProperty(exports, "jwtConfig", { enumerable: true, get: function () { return jwtConfig_1.jwtConfig; } });
