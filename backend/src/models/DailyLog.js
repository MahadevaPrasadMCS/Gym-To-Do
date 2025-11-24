// backend/src/models/DailyLog.js
import mongoose from "mongoose";

const foodEntrySchema = new mongoose.Schema(
  {
    foodItem: { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem" },
    customName: String,
    quantity: { type: Number, default: 1 },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 }
  },
  { _id: false }
);

const workoutEntrySchema = new mongoose.Schema(
  {
    exercise: String,
    sets: Number,
    reps: Number,
    durationMin: Number,
    notes: String
  },
  { _id: false }
);

const dailyLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    date: { type: Date, required: true }, // YYYY-MM-DD
    dayOfWeek: { type: String }, // Mon/Tue/Wed/Thu/Fri/Sat/Sun

    foods: [foodEntrySchema],
    workouts: [workoutEntrySchema],

    totalCalories: { type: Number, default: 0 },
    totalProtein: { type: Number, default: 0 },

    weightKg: Number // optional daily update
  },
  { timestamps: true }
);

// Ensure only one log per user per date
dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("DailyLog", dailyLogSchema);
