"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
/* =========================
   GET STATS
========================= */
router.get("/", (req, res) => {
    res.json({
        success: true,
        data: {
            totalUsers: 120,
            totalDoctors: 35,
            totalAppointments: 540,
            activeToday: 18,
        },
    });
});
exports.default = router;
