// backend/src/index.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import dailyLogsRoutes from "./routes/dailyLogs.js";
import foodRoutes from "./routes/foods.js";
import weeklyCheckinsRoutes from "./routes/weeklyCheckins.js";
import { seedCommonFoods } from "./utils/seedFoods.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "https://gym-to-do.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Simple test route
app.get("/", (req, res) => res.send("Fitness tracker API running"));

app.use("/api/auth", authRoutes);
app.use("/api/daily-logs", dailyLogsRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/weekly-checkins", weeklyCheckinsRoutes);

const PORT = 5000;

// Connect DB + Seed Default Foods
mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("MongoDB connected");
    await seedCommonFoods();
    app.listen(PORT, () => console.log("Server listening on", PORT));
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });
