// frontend/src/pages/DailyLogPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import dayjs from "dayjs";
import { Loader2, PlusCircle, Save, Trash2 } from "lucide-react";

export default function DailyLogPage() {
  const { date } = useParams();
  const selectedDate = date === "today" ? dayjs() : dayjs(date);

  const [foods, setFoods] = useState([]);
  const [libraryFoods, setLibraryFoods] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [weight, setWeight] = useState("");
  const [summary, setSummary] = useState({ calories: 0, protein: 0 });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchFoodsLibrary = async () => {
    const res = await api.get("/foods");
    setLibraryFoods(res.data || []);
  };

  const fetchLog = async () => {
    setLoading(true);
    try {
      const res = await api.get("/daily-logs", {
        params: { date: selectedDate.format("YYYY-MM-DD") },
      });

      const log = res.data;
      if (log) {
        setFoods(log.foods || []);
        setWorkouts(log.workouts || []);
        setWeight(log.weightKg || "");
        setSummary({
          calories: log.totalCalories || 0,
          protein: log.totalProtein || 0,
        });
      } else {
        setFoods([]);
        setWorkouts([]);
        setWeight("");
        setSummary({ calories: 0, protein: 0 });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodsLibrary();
    fetchLog();
    // eslint-disable-next-line
  }, [date]);

  const updateFood = (index, field, value) =>
    setFoods((prev) => {
      const arr = [...prev];
      arr[index] = { ...arr[index], [field]: value };
      return arr;
    });

  const updateWorkout = (index, field, value) =>
    setWorkouts((prev) => {
      const arr = [...prev];
      arr[index] = { ...arr[index], [field]: value };
      return arr;
    });

  const addFood = () =>
    setFoods((prev) => [
      ...prev,
      { customName: "", calories: 0, protein: 0, quantity: 1 },
    ]);

  const removeFood = (index) =>
    setFoods((prev) => prev.filter((_, i) => i !== index));

  const addWorkout = () =>
    setWorkouts((prev) => [
      ...prev,
      { exercise: "", sets: "", reps: "", durationMin: "" },
    ]);

  const removeWorkout = (index) =>
    setWorkouts((prev) => prev.filter((_, i) => i !== index));

  const addFromLibrary = (food) =>
    setFoods((prev) => [
      ...prev,
      {
        foodItemId: food._id,
        customName: food.name,
        calories: food.calories,
        protein: food.protein,
        quantity: 1,
      },
    ]);

  const saveLog = async () => {
    setSaving(true);
    try {
      const payload = {
        date: selectedDate.format("YYYY-MM-DD"),
        foods: foods.map((f) => ({
          ...f,
          calories: Number(f.calories) || 0,
          protein: Number(f.protein) || 0,
          quantity: Number(f.quantity) || 1,
        })),
        workouts: workouts.map((w) => ({
          ...w,
          sets: w.sets ? Number(w.sets) : undefined,
          reps: w.reps ? Number(w.reps) : undefined,
          durationMin: w.durationMin ? Number(w.durationMin) : undefined,
        })),
        weightKg: weight ? Number(weight) : undefined,
      };

      const res = await api.post("/daily-logs", payload);
      setSummary({
        calories: res.data.totalCalories,
        protein: res.data.totalProtein,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center mt-10 text-slate-200">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );

  return (
    <><title>DailyLog</title>
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8 text-slate-100">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">
            Daily Log — {selectedDate.format("DD MMM, ddd")}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track today&apos;s meals, workouts and weight.
          </p>
        </div>
      </div>

      {/* Weight */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-[0_12px_35px_rgba(0,0,0,0.7)]">
        <label className="text-[11px] uppercase tracking-[0.16em] text-slate-400 font-semibold">
          Weight Today
        </label>
        <div className="mt-2 flex items-center gap-3">
          <input
            className="w-28 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-violet-400 focus:shadow-[0_0_12px_rgba(139,92,246,0.6)]"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="kg"
          />
          <span className="text-xs text-slate-400">kg</span>
        </div>
      </section>

      {/* Foods */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-[0_12px_35px_rgba(0,0,0,0.7)] space-y-4">
        <div className="flex justify-between items-center gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-semibold">
              Food Intake
            </h3>
            <p className="text-[11px] text-slate-400">
              Log each meal with calories and protein.
            </p>
          </div>
          <button
            onClick={addFood}
            className="inline-flex items-center gap-2 text-[11px] px-3 py-2 rounded-xl
            bg-violet-600 hover:bg-violet-500 active:scale-95 transition-all font-semibold"
          >
            <PlusCircle className="w-4 h-4" />
            Add Food
          </button>
        </div>

        {/* Quick Add from Library */}
        {libraryFoods.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] text-slate-400">Quick Add from Library</p>
            <div className="flex flex-wrap gap-2">
              {libraryFoods.map((food) => (
                <button
                  key={food._id}
                  onClick={() => addFromLibrary(food)}
                  className="text-[11px] px-3 py-1.5 rounded-full border border-slate-700
                  bg-slate-950/70 hover:bg-violet-600/30 hover:border-violet-500
                  transition-all"
                >
                  {food.name} · {food.protein}g
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Food Cards */}
        <div className="space-y-3">
          {foods.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 sm:p-4 flex flex-col gap-3"
            >
              <div className="flex justify-between items-center gap-2">
                <input
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm
                  outline-none focus:border-violet-400 focus:shadow-[0_0_8px_rgba(139,92,246,0.6)]"
                  placeholder="Food name"
                  value={item.customName}
                  onChange={(e) =>
                    updateFood(i, "customName", e.target.value)
                  }
                />
                <button
                  onClick={() => removeFood(i)}
                  className="p-2 rounded-xl border border-slate-700 hover:border-red-500 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="text-[11px] text-slate-400 mb-1">Quantity</p>
                  <input
                    type="number"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-violet-400"
                    value={item.quantity}
                    onChange={(e) =>
                      updateFood(i, "quantity", e.target.value)
                    }
                  />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 mb-1">Calories</p>
                  <input
                    type="number"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-violet-400"
                    value={item.calories}
                    onChange={(e) =>
                      updateFood(i, "calories", e.target.value)
                    }
                  />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 mb-1">Protein (g)</p>
                  <input
                    type="number"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-violet-400"
                    value={item.protein}
                    onChange={(e) =>
                      updateFood(i, "protein", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}

          {foods.length === 0 && (
            <p className="text-[12px] text-slate-500">
              No foods added yet. Use <span className="font-semibold">Add Food</span> or
              Quick Add to start logging.
            </p>
          )}
        </div>
      </section>

      {/* Workouts */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-[0_12px_35px_rgba(0,0,0,0.7)] space-y-4">
        <div className="flex justify-between items-center gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-semibold">
              Workout Activity
            </h3>
            <p className="text-[11px] text-slate-400">
              Log your strength or cardio sessions.
            </p>
          </div>
          <button
            onClick={addWorkout}
            className="inline-flex items-center gap-2 text-[11px] px-3 py-2 rounded-xl
            bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all font-semibold"
          >
            <PlusCircle className="w-4 h-4" />
            Add Workout
          </button>
        </div>

        <div className="space-y-3">
          {workouts.map((w, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 sm:p-4 flex flex-col gap-3"
            >
              <div className="flex justify-between items-center gap-2">
                <input
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm
                  outline-none focus:border-emerald-400 focus:shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                  placeholder="Exercise (e.g. Push-ups, Squats)"
                  value={w.exercise}
                  onChange={(e) =>
                    updateWorkout(i, "exercise", e.target.value)
                  }
                />
                <button
                  onClick={() => removeWorkout(i)}
                  className="p-2 rounded-xl border border-slate-700 hover:border-red-500 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="text-[11px] text-slate-400 mb-1">Sets</p>
                  <input
                    type="number"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400"
                    value={w.sets}
                    onChange={(e) =>
                      updateWorkout(i, "sets", e.target.value)
                    }
                  />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 mb-1">Reps</p>
                  <input
                    type="number"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400"
                    value={w.reps}
                    onChange={(e) =>
                      updateWorkout(i, "reps", e.target.value)
                    }
                  />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 mb-1">Time (min)</p>
                  <input
                    type="number"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400"
                    value={w.durationMin}
                    onChange={(e) =>
                      updateWorkout(i, "durationMin", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}

          {workouts.length === 0 && (
            <p className="text-[12px] text-slate-500">
              No workouts logged yet. Even a short session counts.
            </p>
          )}
        </div>
      </section>

      {/* Summary + Save */}
      <div className="flex flex-col gap-3 pb-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-[11px] text-slate-400 mb-1">Daily Summary</p>
            <div className="text-sm sm:text-base font-semibold">
              {summary.calories} kcal • {summary.protein}g protein
            </div>
          </div>
          <div className="w-full sm:w-1/2 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 via-sky-400 to-emerald-400"
              style={{
                width: summary.calories
                  ? `${Math.min(100, Math.round((summary.calories / 2600) * 100))}%`
                  : "5%",
              }}
            />
          </div>
        </div>

        <div className="sticky bottom-4 flex justify-end">
          <button
            onClick={saveLog}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl px-5 py-2.5
            bg-violet-600 hover:bg-violet-500 active:scale-95 transition-all
            text-sm font-semibold shadow-[0_12px_30px_rgba(139,92,246,0.6)]
            disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            <Save className="w-4 h-4" />
            Save Log
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
