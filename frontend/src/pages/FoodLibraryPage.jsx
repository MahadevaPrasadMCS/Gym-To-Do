import { useEffect, useState, useMemo } from "react";
import api from "../utils/api";
import {
  PlusCircle,
  Search,
  Egg,
  Leaf,
  Trash2,
  Settings,
} from "lucide-react";

export default function FoodLibraryPage() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    calories: "",
    protein: "",
    category: "veg",
  });

  const [error, setError] = useState("");

  const fetchFoods = async () => {
    try {
      const res = await api.get("/foods");
      setFoods(res.data || []);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const filteredFoods = useMemo(() => {
    return foods.filter((f) =>
      f.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [foods, search]);

  const createFood = async (e) => {
    e.preventDefault();
    if (!form.name || !form.calories || !form.protein) {
      setError("Please fill all fields");
      return;
    }

    try {
      await api.post("/foods", {
        name: form.name.trim(),
        calories: Number(form.calories),
        protein: Number(form.protein),
        category: form.category,
      });

      setForm({ name: "", calories: "", protein: "", category: "veg" });
      setError("");
      fetchFoods();
    } catch {
      setError("Failed to add food");
    }
  };

  const deleteFood = async (id) => {
    await api.delete(`/foods/${id}`);
    fetchFoods();
  };

  const icon = (type) =>
    type === "veg" ? (
      <Leaf className="text-emerald-400" size={18} />
    ) : (
      <Egg className="text-yellow-400" size={18} />
    );

  return (
    <>
    <title>Food - Library</title>
    <div className="max-w-4xl mx-auto p-6 space-y-10 text-slate-100">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">Food Library</h2>
        <p className="text-sm text-slate-400">
          Vegetarian + Egg-based items only 🌱🥚
        </p>
      </div>

      {/* Add Food Card */}
      <form
        onSubmit={createFood}
        className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-[0_12px_35px_rgba(0,0,0,0.7)] space-y-5"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Add New Item</h3>
          <Settings className="text-emerald-400" size={20} />
        </div>

        {error && (
          <div className="text-xs text-red-400 bg-red-950/40 border border-red-800 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid sm:grid-cols-4 gap-4 text-sm">
          <InputField
            label="Food Name"
            value={form.name}
            onChange={(val) => setForm({ ...form, name: val })}
            placeholder="Paneer"
          />
          <InputField
            label="Calories"
            type="number"
            value={form.calories}
            placeholder="265"
            onChange={(val) => setForm({ ...form, calories: val })}
          />
          <InputField
            label="Protein"
            type="number"
            value={form.protein}
            placeholder="18"
            onChange={(val) => setForm({ ...form, protein: val })}
          />
          <div>
            <label className="text-[11px] text-slate-400">Category</label>
            <select
              className="input-theme mt-1"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="veg">Veg</option>
              <option value="egg">Egg</option>
            </select>
          </div>
        </div>

        <button className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition px-4 py-2 rounded-xl">
          <PlusCircle size={18} /> Add Food
        </button>
      </form>

      {/* Search */}
      <div className="relative w-full sm:w-72">
        <input
          className="input-theme pl-10"
          placeholder="Search foods..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute top-3 left-3 w-5 h-5 text-slate-500" />
      </div>

      {/* Foods List */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredFoods.map((f) => (
          <div
            key={f._id}
            className="bg-slate-950/70 border border-slate-800 shadow-[0_8px_25px_rgba(0,0,0,0.45)] p-4 rounded-2xl flex justify-between items-center"
          >
            <div>
              <div className="flex items-center gap-2 font-semibold">
                {icon(f.category)}
                {f.name}
              </div>
              <div className="text-xs text-slate-400">
                {f.calories} kcal • {f.protein}g protein
              </div>
            </div>

            <button
              onClick={() => deleteFood(f._id)}
              className="p-2 rounded-lg border border-slate-700 hover:border-red-500 hover:bg-red-500/10 transition"
            >
              <Trash2 size={18} className="text-red-500" />
            </button>
          </div>
        ))}
      </div>

      {filteredFoods.length === 0 && (
        <p className="text-sm text-center text-slate-500">
          No foods found. Add something! 🍽️
        </p>
      )}
    </div>
    </>
  );
}

// 🔹 Small Reusable Component for Input
function InputField({ label, type = "text", placeholder, value, onChange }) {
  return (
    <div>
      <label className="text-[11px] text-slate-400">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-theme mt-1"
      />
    </div>
  );
}
