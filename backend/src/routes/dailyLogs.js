import express from "express";
import dayjs from "dayjs";
import DailyLog from "../models/DailyLog.js";
import FoodItem from "../models/FoodItem.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
router.use(authMiddleware);

// Fetch log for a date
router.get("/", async (req, res) => {
  try {
    const dateStr = req.query.date;
    const date = dayjs(dateStr).startOf("day").toDate();

    const log = await DailyLog.findOne({
      userId: req.user.id,
      date
    }).populate("foods.foodItem");

    res.json(log || null);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch log" });
  }
});

// Create/Update log
router.post("/", async (req, res) => {
  try {
    const { date, foods = [], workouts = [], weightKg } = req.body;
    const dateObj = dayjs(date).startOf("day").toDate();
    const dayOfWeek = dayjs(dateObj).format("ddd");

    let totalCalories = 0;
    let totalProtein = 0;

    const resolvedFoods = await Promise.all(
      foods.map(async (item) => {
        if (item.foodItemId) {
          const food = await FoodItem.findOne({
            _id: item.foodItemId,
            userId: req.user.id
          });
          if (!food) return null;

          const calories = food.calories * item.quantity;
          const protein = food.protein * item.quantity;
          totalCalories += calories;
          totalProtein += protein;

          return {
            foodItem: food._id,
            quantity: item.quantity,
            calories,
            protein
          };
        } else {
          totalCalories += item.calories * item.quantity;
          totalProtein += item.protein * item.quantity;
          return item;
        }
      })
    );

    const foodsFiltered = resolvedFoods.filter(Boolean);

    const log = await DailyLog.findOneAndUpdate(
      { userId: req.user.id, date: dateObj },
      {
        date: dateObj,
        dayOfWeek,
        foods: foodsFiltered,
        workouts,
        weightKg,
        totalCalories,
        totalProtein
      },
      { upsert: true, new: true }
    );

    res.json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save log" });
  }
});

export default router;
