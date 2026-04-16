"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const baseURL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:4000";
const api = axios_1.default.create({
    baseURL: `${baseURL}/api`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});
api.interceptors.request.use((config) => {
    const token = typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
api.interceptors.response.use((response) => response, (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
        localStorage.removeItem("token");
        if (window.location.pathname !== "/login") {
            window.location.href = "/login";
        }
    }
    return Promise.reject(error);
});
exports.default = api;
