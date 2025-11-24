import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import FoodItem from "./models/FoodItem.js";

const fixCategories = async () => {
  await mongoose.connect(process.env.MONGO_URL);

  const result = await FoodItem.updateMany(
    { category: { $exists: false } },
    { $set: { category: "veg" } }
  );

  console.log("Updated:", result.modifiedCount, "foods");
  mongoose.disconnect();
};

fixCategories();
