import express from "express";
import dayjs from "dayjs";
import DailyLog from "../models/DailyLog.js";
import WeeklyCheckin from "../models/WeeklyCheckin.js";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
router.use(authMiddleware);

// Get latest check-in
router.get("/latest", async (req, res) => {
  const checkin = await WeeklyCheckin.findOne({
    userId: req.user.id
  }).sort({ weekEndDate: -1 });

  res.json(checkin || null);
});

// Create weekly check-in
router.post("/", async (req, res) => {
  try {
    const today = dayjs();
    if (today.day() !== 0) {
      return res.status(403).json({
        message: "Weekly check-in allowed only on Sundays"
      });
    }

    const { startWeightKg, endWeightKg, weekStartDate, weekEndDate } = req.body;
    const user = await User.findById(req.user.id);

    const start = dayjs(weekStartDate).startOf("day").toDate();
    const end = dayjs(weekEndDate).endOf("day").toDate();

    const logs = await DailyLog.find({
      userId: req.user.id,
      date: { $gte: start, $lte: end }
    });

    const totalDays = logs.length || 1;
    const sumCal = logs.reduce((acc, d) => acc + (d.totalCalories || 0), 0);
    const sumProt = logs.reduce((acc, d) => acc + (d.totalProtein || 0), 0);

    const avgDailyCalories = Math.round(sumCal / totalDays);
    const avgDailyProtein = Math.round(sumProt / totalDays);

    const daysMetCalorieTarget = logs.filter(
      (d) => d.totalCalories >= user.dailyCalorieTarget
    ).length;

    const daysMetProteinTarget = logs.filter(
      (d) => d.totalProtein >= user.dailyProteinTarget
    ).length;

   const startW = Number(startWeightKg) || user.currentWeightKg || 0;
  const gain = Number(user.targetWeeklyGainKg) || 0.4;
  const expectedEndWeightKg = Number((startW + gain).toFixed(1));

    const checkin = await WeeklyCheckin.create({
      userId: req.user.id,
      weekStartDate: start,
      weekEndDate: end,
      startWeightKg,
      endWeightKg,
      expectedEndWeightKg,
      avgDailyCalories,
      avgDailyProtein,
      daysMetCalorieTarget,
      daysMetProteinTarget
    });

    res.json(checkin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create weekly check-in" });
  }
});

export default router;
