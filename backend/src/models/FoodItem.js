// models/FoodItem.js
import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },

    name: { type: String, required: true },

    // per 1 serving
    servingSize: { type: String, default: "1 unit" },

    calories: { type: Number, required: true },
    protein: { type: Number, required: true }, // grams

    // New: Dietary category
    category: {
      type: String,
      enum: ["veg", "egg", "other"],
      default: "veg",
    },

    // Default library items
    isCommon: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("FoodItem", foodItemSchema);
