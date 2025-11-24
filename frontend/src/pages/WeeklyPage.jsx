import { useState, useEffect } from "react";
import dayjs from "dayjs";
import api from "../utils/api";
import { Loader2, CalendarDays } from "lucide-react";

export default function WeeklyPage() {
  const today = dayjs();
  const weekStart = today.startOf("week").add(1, "day"); // Monday
  const weekEnd = today.endOf("week"); // Sunday
  const isSunday = today.day() === 0;

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  const [startWeightKg, setStartWeightKg] = useState("");
  const [endWeightKg, setEndWeightKg] = useState("");
  const [loading, setLoading] = useState(false);

  // Countdown Timer
  useEffect(() => {
    const interval = setInterval(() => {
      const totalMinutes = weekEnd.diff(dayjs(), "minute");
      const days = Math.floor(totalMinutes / (60 * 24));
      const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
      const minutes = totalMinutes % 60;
      setTimeLeft({ days, hours, minutes });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    if (!startWeightKg || !endWeightKg) {
      alert("Enter both weights");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/weekly-checkins", {
        startWeightKg,
        endWeightKg,
        weekStartDate: weekStart.toDate(),
        weekEndDate: weekEnd.toDate(),
      });

      alert("Weekly check-in saved!");
      setStartWeightKg("");
      setEndWeightKg("");
    } catch (err) {
      console.error(err);
      alert("Error submitting check-in.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RENDER ---------------- //

  if (!isSunday) {
    return (
      <>
      <title>Weekly - CheckIn</title>
      <div className="text-center flex flex-col items-center justify-center w-full h-full p-6 text-slate-100">
        <h2 className="text-3xl font-extrabold mb-3 drop-shadow">
          Weekly Check-in Locked 🔒
        </h2>
        <p className="text-slate-400 max-w-sm">
          You can check-in only on Sundays.
        </p>

        <div className="mt-6 px-6 py-4 bg-slate-900/70 border border-slate-800 backdrop-blur-xl rounded-2xl shadow-lg animate-pulse text-lg font-semibold">
          Unlocks in: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
        </div>
      </div>
      </>
    );
  }

  return (
    <>
    <title>Weekly - CheckIn</title>
    <div className="max-w-xl mx-auto p-6 space-y-8 text-slate-100">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Weekly Check-In 📅
        </h1>
        <p className="text-xs text-slate-400">
          Track your progress and stay consistent!
        </p>
      </header>

      {/* Glass card */}
      <div className="bg-slate-900/70 border border-slate-800 backdrop-blur-xl rounded-2xl shadow-[0_0_30px_rgba(56,189,248,0.15)] p-6 space-y-6">
        <div>
          <label className="text-xs text-slate-400 font-medium">
            Start Weight (kg) – This Monday
          </label>
          <input
            type="number"
            value={startWeightKg}
            onChange={(e) => setStartWeightKg(e.target.value)}
            className="input-theme mt-1"
            min="0"
            step="0.1"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 font-medium">
            End Weight (kg) – Today
          </label>
          <input
            type="number"
            value={endWeightKg}
            onChange={(e) => setEndWeightKg(e.target.value)}
            className="input-theme mt-1"
            min="0"
            step="0.1"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition px-4 py-3 rounded-xl font-semibold disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <CalendarDays className="w-5 h-5" />
              Save Weekly Progress
            </>
          )}
        </button>
      </div>
    </div>
    </>
  );
}
