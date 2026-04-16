"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const User_1 = __importDefault(require("../../models/User"));
class AuthRepository {
    /* ================= FIND BY EMAIL ================= */
    static findByEmail(email) {
        return User_1.default.findOne({ email }).exec();
    }
    /* ================= FIND BY ID ================= */
    static findById(id) {
        return User_1.default.findById(id).exec();
    }
    /* ================= CREATE USER ================= */
    static create(data) {
        return new User_1.default(data).save();
    }
    /* ================= UPDATE USER ================= */
    static updateById(id, update) {
        return User_1.default.findByIdAndUpdate(id, update, {
            new: true,
            runValidators: true,
        }).exec();
    }
    /* ================= GENERIC FIND ONE ================= */
    static findOne(filter) {
        return User_1.default.findOne(filter).exec();
    }
    /* ================= SAVE USER ================= */
    static save(user) {
        return user.save();
    }
}
exports.AuthRepository = AuthRepository;
