// models/WeeklyCheckin.js
import mongoose from "mongoose";

const weeklyCheckinSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    weekStartDate: Date,   // Monday
    weekEndDate: Date,     // Sunday
    startWeightKg: Number,
    endWeightKg: Number,
    expectedEndWeightKg: Number,
    avgDailyCalories: Number,
    avgDailyProtein: Number,
    daysMetCalorieTarget: Number,
    daysMetProteinTarget: Number,
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model("WeeklyCheckin", weeklyCheckinSchema);
