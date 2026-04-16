"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const api_1 = __importDefault(require("../utils/api"));
exports.authService = {
    register: async (data) => {
        const res = await api_1.default.post("/auth/register", data);
        if (res.data?.token) {
            localStorage.setItem("token", res.data.token);
        }
        return res.data;
    },
    login: async (data) => {
        const res = await api_1.default.post("/auth/login", data);
        if (res.data?.token) {
            localStorage.setItem("token", res.data.token);
        }
        return res.data;
    },
    logout: () => {
        localStorage.removeItem("token");
    },
};
