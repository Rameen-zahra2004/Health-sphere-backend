"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenVersion = exports.revokeUserTokens = void 0;
const TokenVersion_1 = __importDefault(require("../../models/TokenVersion"));
/**
 * Increase version = invalidates ALL old tokens
 */
const revokeUserTokens = async (userId) => {
    await TokenVersion_1.default.findOneAndUpdate({ userId }, { $inc: { version: 1 } }, { upsert: true, new: true });
};
exports.revokeUserTokens = revokeUserTokens;
/**
 * Get current token version
 */
const getTokenVersion = async (userId) => {
    const record = await TokenVersion_1.default.findOne({ userId });
    if (!record) {
        const created = await TokenVersion_1.default.create({ userId, version: 0 });
        return created.version;
    }
    return record.version;
};
exports.getTokenVersion = getTokenVersion;
