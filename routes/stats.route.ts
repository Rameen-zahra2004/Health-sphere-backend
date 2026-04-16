import { Router, Request, Response } from "express";

const router = Router();

/* =========================
   GET STATS
========================= */
router.get("/", (req: Request, res: Response) => {
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

export default router;