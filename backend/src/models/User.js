// backend/src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },

    // Fitness-specific
    heightCm: Number,
    currentWeightKg: Number,
    targetWeeklyGainKg: { type: Number, default: 0.4 },
    dailyCalorieTarget: { type: Number, default: 2600 },
    dailyProteinTarget: { type: Number, default: 100 }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
