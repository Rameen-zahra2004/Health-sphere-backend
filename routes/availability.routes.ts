import express from "express";
import { protect } from "../middleware/authMiddleware";
import { isDoctor } from "../middleware/doctor.middleware";

import {
  setAvailability,
  getAvailability,
  updateAvailability,
  deleteAvailability,
} from "../controllers/availability.controller";

const router = express.Router();

router.post("/", protect, isDoctor, setAvailability);

router.get("/", protect, isDoctor, getAvailability);

router.put("/:id", protect, isDoctor, updateAvailability);

router.delete("/:id", protect, isDoctor, deleteAvailability);

export default router;