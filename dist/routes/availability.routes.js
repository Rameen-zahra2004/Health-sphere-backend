"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const doctor_middleware_1 = require("../middleware/doctor.middleware");
const availability_controller_1 = require("../controllers/availability.controller");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.protect, doctor_middleware_1.isDoctor, availability_controller_1.setAvailability);
router.get("/", authMiddleware_1.protect, doctor_middleware_1.isDoctor, availability_controller_1.getAvailability);
router.put("/:id", authMiddleware_1.protect, doctor_middleware_1.isDoctor, availability_controller_1.updateAvailability);
router.delete("/:id", authMiddleware_1.protect, doctor_middleware_1.isDoctor, availability_controller_1.deleteAvailability);
exports.default = router;
