// backend/src/utils/seedFoods.js
import FoodItem from "../models/FoodItem.js";

export const seedCommonFoods = async () => {
  const count = await FoodItem.countDocuments({ isCommon: true });
  if (count > 0) return;

  const items = [
    { name: "Banana", calories: 90, protein: 1 },
    { name: "Milk (250ml)", calories: 150, protein: 8 },
    { name: "Paneer (100g)", calories: 265, protein: 18 },
    { name: "Dal (1 cup)", calories: 170, protein: 12 },
    { name: "Rice (1 cup)", calories: 210, protein: 4 },
    { name: "Chapati (1)", calories: 120, protein: 3 },
    { name: "Dosa (1)", calories: 133, protein: 2.5 },
    { name: "Idli (1)", calories: 70, protein: 2 },
    { name: "Peanuts (50g)", calories: 282, protein: 13 },
    { name: "Curd (100g)", calories: 60, protein: 3 }
  ];

  await FoodItem.insertMany(items.map(i => ({ ...i, isCommon: true })));
  console.log("Default foods inserted");
};
