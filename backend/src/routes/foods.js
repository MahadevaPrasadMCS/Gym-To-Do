// routes/foods.js
import express from "express";
import FoodItem from "../models/FoodItem.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
router.use(authMiddleware);

// Get user foods + common defaults
router.get("/", async (req, res) => {
  try {
    const foods = await FoodItem.find({
      $or: [
        { userId: req.user.id },
        { isCommon: true }
      ],
      category: { $in: ["veg", "egg"] }
    })
      .sort({ name: 1 })
      .lean();

    res.json(foods);
  } catch (err) {
    console.error("Failed to fetch foods:", err);
    res.status(500).json({ message: "Failed to fetch foods" });
  }
});

// Create new food item
router.post("/", async (req, res) => {
  try {
    const { name, calories, protein, category } = req.body;

    if (!name || !calories || !protein) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const food = await FoodItem.create({
      userId: req.user.id,
      name: name.trim(),
      calories: Number(calories),
      protein: Number(protein),
      category: category || "veg",
      isCommon: false // newly added items belong to user
    });

    res.status(201).json(food);
  } catch (err) {
    console.error("Failed to create food:", err);
    res.status(500).json({ message: "Failed to create food" });
  }
});

// Delete food item
router.delete("/:id", async (req, res) => {
  try {
    await FoodItem.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    res.json({ message: "Food deleted" });
  } catch (err) {
    console.error("Failed to delete food:", err);
    res.status(500).json({ message: "Failed to delete food" });
  }
});

export default router;
