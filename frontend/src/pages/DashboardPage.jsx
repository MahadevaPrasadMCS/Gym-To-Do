// frontend/src/pages/DashboardPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../utils/api";
import {
  Flame,
  Dumbbell,
  Beef,
  Target,
  TrendingUp,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Activity,
  Award,
  ClipboardList,
  HeartPulse,
  ArrowRightCircle,
} from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const username = "Mahadeva Prasad";

  const motivationalQuotes = [
    "Small steps every day lead to big changes.",
    "Fuel your body. Elevate your life.",
    "Consistency beats perfection.",
    "Every rep brings you closer.",
    "Eat clean. Train smart. Stay strong.",
    "Discipline is the bridge between goals and results.",
  ];

  const [quoteIndex, setQuoteIndex] = useState(
    Math.floor(Math.random() * motivationalQuotes.length)
  );

  const [loading, setLoading] = useState(true);
  const [dailyOverview, setDailyOverview] = useState({
    calories: 0,
    protein: 0,
    calorieTarget: 2600,
    proteinTarget: 120,
    workoutsCount: 0,
  });

  const [weeklyLogs, setWeeklyLogs] = useState([]); // last 7 days
  const [weeklyCheckin, setWeeklyCheckin] = useState(null);
  const [streakInfo, setStreakInfo] = useState({
    calorieStreak: 0,
    proteinStreak: 0,
    workoutStreak: 0,
  });

  const today = dayjs();

  // -------------------- Data Fetching --------------------

  const fetchWeeklyLogs = async () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = dayjs().subtract(i, "day");
      const dateStr = d.format("YYYY-MM-DD");
      try {
        const res = await api.get("/daily-logs", {
          params: { date: dateStr },
        });
        const log = res.data;
        days.push({
          date: d,
          calories: log?.totalCalories || 0,
          protein: log?.totalProtein || 0,
          workouts: log?.workouts?.length || 0,
        });
      } catch (err) {
        days.push({
          date: d,
          calories: 0,
          protein: 0,
          workouts: 0,
        });
      }
    }
    return days;
  };

  const computeStreaksFromWeekly = (weekDays, calorieTarget, proteinTarget) => {
    let calorieStreak = 0;
    let proteinStreak = 0;
    let workoutStreak = 0;

    for (let i = weekDays.length - 1; i >= 0; i--) {
      const day = weekDays[i];
      if (day.calories >= calorieTarget) calorieStreak++;
      else break;
    }

    for (let i = weekDays.length - 1; i >= 0; i--) {
      const day = weekDays[i];
      if (day.protein >= proteinTarget) proteinStreak++;
      else break;
    }

    for (let i = weekDays.length - 1; i >= 0; i--) {
      const day = weekDays[i];
      if (day.workouts > 0) workoutStreak++;
      else break;
    }

    return { calorieStreak, proteinStreak, workoutStreak };
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const todayStr = today.format("YYYY-MM-DD");

      const [todayRes, weeklyDays, checkinRes] = await Promise.all([
        api
          .get("/daily-logs", { params: { date: todayStr } })
          .catch(() => ({ data: null })),
        fetchWeeklyLogs(),
        api.get("/weekly-checkins/latest").catch(() => ({ data: null })),
      ]);

      const todayLog = todayRes.data;
      const weeklyCheckin = checkinRes.data;

      const calorieTarget =
        todayLog?.calorieTarget ||
        weeklyCheckin?.avgDailyCalories ||
        2600;
      const proteinTarget =
        todayLog?.proteinTarget ||
        weeklyCheckin?.avgDailyProtein ||
        120;

      setDailyOverview({
        calories: todayLog?.totalCalories || 0,
        protein: todayLog?.totalProtein || 0,
        calorieTarget,
        proteinTarget,
        workoutsCount: todayLog?.workouts?.length || 0,
      });

      setWeeklyLogs(weeklyDays);
      setWeeklyCheckin(weeklyCheckin);

      const streaks = computeStreaksFromWeekly(
        weeklyDays,
        calorieTarget,
        proteinTarget
      );
      setStreakInfo(streaks);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line
  }, []);

  const caloriesProgress = useMemo(() => {
    if (!dailyOverview.calorieTarget) return 0;
    return Math.min(
      100,
      Math.round((dailyOverview.calories / dailyOverview.calorieTarget) * 100)
    );
  }, [dailyOverview]);

  const proteinProgress = useMemo(() => {
    if (!dailyOverview.proteinTarget) return 0;
    return Math.min(
      100,
      Math.round((dailyOverview.protein / dailyOverview.proteinTarget) * 100)
    );
  }, [dailyOverview]);

  const weeklyAverages = useMemo(() => {
    if (weeklyLogs.length === 0) return { avgCalories: 0, avgProtein: 0 };
    const totalCal = weeklyLogs.reduce((acc, d) => acc + d.calories, 0);
    const totalProt = weeklyLogs.reduce((acc, d) => acc + d.protein, 0);
    const days = weeklyLogs.length || 1;
    return {
      avgCalories: Math.round(totalCal / days),
      avgProtein: Math.round(totalProt / days),
    };
  }, [weeklyLogs]);

  const todayQuote = motivationalQuotes[quoteIndex];

  const changeQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
  };

  const todayLabel = today.format("dddd, DD MMM");

  // -------------------- Render --------------------

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto p-4 flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-slate-200">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Preparing your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <title>Dashboard</title>
    <div className="w-full max-w-6xl mx-auto p-4 space-y-8 text-slate-100">
      {/* Top: Greeting + Hero */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)]">
        {/* Greeting + Quote */}
        <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800/80 shadow-[0_18px_45px_rgba(0,0,0,0.65)] p-5 flex flex-col justify-between">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-violet-400 uppercase tracking-[0.18em]">
              Daily Focus
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Hey {username}, let&apos;s win today 💪
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <CalendarDays className="w-3 h-3" />
              {todayLabel}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="text-[11px] text-slate-400 mb-1">Today&apos;s Thought</p>
              <p className="text-sm font-medium text-slate-100">
                “{todayQuote}”
              </p>
            </div>
            <button
              onClick={changeQuote}
              className="mt-2 sm:mt-0 inline-flex items-center gap-2 text-[11px] px-3 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 active:scale-[0.98] transition"
            >
              <HeartPulse className="w-4 h-4 text-rose-400" />
              New Thought
            </button>
          </div>
        </div>

        {/* Hero Visual + Goal */}
        <div className="bg-gradient-to-br from-violet-600 via-indigo-500 to-sky-500 rounded-2xl p-4 sm:p-5 text-white shadow-[0_22px_50px_rgba(88,28,135,0.7)] flex flex-col justify-between">
          <div className="flex justify-between items-start gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] opacity-80">
                Weekly Goal
              </p>
              <p className="text-lg sm:text-xl font-semibold mt-1">
                Gain +0.4 kg & hit 4 workouts
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.18em] opacity-80">
                Current Week
              </p>
              <p className="text-xs sm:text-sm font-medium">
                {weeklyCheckin
                  ? `${dayjs(weeklyCheckin.weekStartDate).format(
                      "DD MMM"
                    )} – ${dayjs(weeklyCheckin.weekEndDate).format("DD MMM")}`
                  : "Not checked-in yet"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-[11px] opacity-90">
              <span>Weight Trend</span>
              <span className="font-semibold">
                {weeklyCheckin?.startWeightKg
                  ? `${weeklyCheckin.startWeightKg.toFixed(1)}kg → ${
                      weeklyCheckin.endWeightKg
                        ? weeklyCheckin.endWeightKg.toFixed(1) + "kg"
                        : weeklyCheckin.expectedEndWeightKg
                        ? weeklyCheckin.expectedEndWeightKg.toFixed(1) +
                          "kg (target)"
                        : "Target"
                    }`
                  : "Check-in to track"}
              </span>
            </div>

            <div className="h-2 rounded-full bg-white/25 overflow-hidden">
              <div
                className="h-full bg-white/90 rounded-full transition-all"
                style={{
                  width:
                    weeklyCheckin && weeklyCheckin.startWeightKg
                      ? Math.min(
                          100,
                          Math.round(
                            ((weeklyCheckin.endWeightKg ||
                              weeklyCheckin.expectedEndWeightKg ||
                              weeklyCheckin.startWeightKg) /
                              weeklyCheckin.startWeightKg) *
                              100
                          )
                        ) + "%"
                      : "35%",
                }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] opacity-90">
              <span>
                Target gain:{" "}
                {weeklyCheckin?.expectedEndWeightKg &&
                weeklyCheckin?.startWeightKg
                  ? (
                      weeklyCheckin.expectedEndWeightKg -
                      weeklyCheckin.startWeightKg
                    ).toFixed(1)
                  : "0.4"}
                kg / week
              </span>
              <button
                onClick={() => navigate("/weekly-checkin")}
                className="inline-flex items-center gap-1 text-[11px] font-medium underline underline-offset-4"
              >
                Weekly Check-in
                <ArrowRightCircle className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Today Overview Cards */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold">
            Today’s Overview
          </h2>
          <button
            onClick={() => navigate("/daily-log/today")}
            className="inline-flex items-center gap-1 text-[11px] sm:text-xs px-3 py-1.5 rounded-full border border-slate-600 hover:bg-slate-800 transition"
          >
            <ClipboardList className="w-3 h-3" />
            Open Today&apos;s Log
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <OverviewCard
            label="Calories"
            icon={<Flame className="w-4 h-4 text-orange-400" />}
            value={`${dailyOverview.calories} / ${dailyOverview.calorieTarget} kcal`}
            note={
              caloriesProgress >= 90
                ? "Nice! You're almost at your target."
                : "Fuel up with quality meals."
            }
            progress={caloriesProgress}
            accent="from-amber-400/60 to-orange-500/70"
          />
          <OverviewCard
            label="Protein"
            icon={<Beef className="w-4 h-4 text-rose-400" />}
            value={`${dailyOverview.protein} / ${dailyOverview.proteinTarget} g`}
            note={
              proteinProgress >= 90
                ? "Great for muscle recovery."
                : "Prioritize protein-rich foods."
            }
            progress={proteinProgress}
            accent="from-rose-400/60 to-pink-500/70"
          />
          <OverviewCard
            label="Workout"
            icon={<Dumbbell className="w-4 h-4 text-sky-400" />}
            value={
              dailyOverview.workoutsCount > 0
                ? `${dailyOverview.workoutsCount} session${
                    dailyOverview.workoutsCount > 1 ? "s" : ""
                  } logged`
                : "Not logged yet"
            }
            note={
              dailyOverview.workoutsCount > 0
                ? "Awesome. Keep the streak going."
                : "Even 20 mins counts."
            }
            progress={Math.min(
              100,
              dailyOverview.workoutsCount * 50 || 10
            )}
            accent="from-sky-400/60 to-indigo-500/70"
          />
        </div>
      </section>

      {/* Middle: Weekly Summary + Streaks */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1.1fr)]">
        {/* Weekly Summary */}
        <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-[0_18px_45px_rgba(0,0,0,0.6)] p-4 sm:p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm sm:text-base font-semibold">
                Last 7 Days
              </h3>
              <p className="text-xs text-slate-400">
                Calories &amp; protein trend
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <TrendingUp className="w-3 h-3" />
              Consistency view
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>
                Avg: {weeklyAverages.avgCalories} kcal ·{" "}
                {weeklyAverages.avgProtein} g
              </span>
              <span>
                Today: {dailyOverview.calories} kcal ·{" "}
                {dailyOverview.protein} g
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {weeklyLogs.map((day, idx) => {
                const calRatio = Math.min(
                  1,
                  day.calories / (dailyOverview.calorieTarget || 2600)
                );
                const protRatio = Math.min(
                  1,
                  day.protein / (dailyOverview.proteinTarget || 120)
                );
                const maxHeight = 60;
                const calHeight = Math.max(4, Math.round(calRatio * maxHeight));
                const protHeight = Math.max(
                  2,
                  Math.round(protRatio * maxHeight)
                );
                const isToday = day.date.isSame(today, "day");

                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="h-[70px] flex items-end gap-[3px]">
                      <div
                        className="w-[7px] rounded-full bg-slate-800"
                        style={{ height: maxHeight }}
                      />
                      <div
                        className={`w-[9px] rounded-full bg-gradient-to-t from-sky-500 to-sky-300 ${
                          isToday ? "ring-2 ring-sky-400/70" : ""
                        }`}
                        style={{ height: calHeight }}
                        title={`${day.calories} kcal`}
                      />
                      <div
                        className={`w-[7px] rounded-full bg-gradient-to-t from-emerald-500 to-emerald-300 ${
                          isToday ? "ring-2 ring-emerald-400/70" : ""
                        }`}
                        style={{ height: protHeight }}
                        title={`${day.protein} g`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {day.date.format("dd")}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 text-[11px] text-slate-400 mt-1">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-sky-400" />
                Calories
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                Protein
              </div>
            </div>
          </div>
        </div>

        {/* Streaks & Quick Actions */}
        <div className="space-y-4">
          <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-[0_18px_45px_rgba(0,0,0,0.6)] p-4 sm:p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm sm:text-base font-semibold">
                  Streaks
                </h3>
                <p className="text-xs text-slate-400">
                  Keep stacking your progress
                </p>
              </div>
              <Award className="w-5 h-5 text-amber-400" />
            </div>

            <div className="space-y-3">
              <StreakRow
                label="Calorie target met"
                days={streakInfo.calorieStreak}
              />
              <StreakRow
                label="Protein target met"
                days={streakInfo.proteinStreak}
              />
              <StreakRow
                label="Workout days in a row"
                days={streakInfo.workoutStreak}
              />
            </div>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-[0_18px_45px_rgba(0,0,0,0.6)] p-4 sm:p-5 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm sm:text-base font-semibold">
                  Quick Actions
                </h3>
                <p className="text-xs text-slate-400">
                  Jump straight into what matters
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <QuickActionButton
                icon={<ClipboardList className="w-4 h-4" />}
                label="Log Today’s Meals"
                onClick={() => navigate("/daily-log/today")}
              />
              <QuickActionButton
                icon={<Dumbbell className="w-4 h-4" />}
                label="Add Workout"
                onClick={() => navigate("/daily-log/today")}
              />
              <QuickActionButton
                icon={<Flame className="w-4 h-4" />}
                label="View Food Library"
                onClick={() => navigate("/foods")}
              />
              <QuickActionButton
                icon={<Target className="w-4 h-4" />}
                label="Weekly Check-In"
                onClick={() => navigate("/weekly-checkin")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom: Daily checklist & tips */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)] pb-4">
        {/* Checklist */}
        <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-[0_18px_45px_rgba(0,0,0,0.6)] p-4 sm:p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm sm:text-base font-semibold">
                Today&apos;s Checklist
              </h3>
              <p className="text-xs text-slate-400">
                Simple tasks to stay on track
              </p>
            </div>
            <Activity className="w-5 h-5 text-sky-400" />
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <ChecklistRow
              done={dailyOverview.calories > 0}
              label="Log all meals for today"
            />
            <ChecklistRow
              done={dailyOverview.protein >= dailyOverview.proteinTarget}
              label="Reach protein target"
            />
            <ChecklistRow
              done={dailyOverview.workoutsCount > 0}
              label="Complete at least one workout"
            />
            <ChecklistRow done={false} label="Drink 2–3L of water" />
            <ChecklistRow done={false} label="Sleep 7+ hours tonight" />
          </div>
        </div>

        {/* Tips & Thoughts */}
        <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-[0_18px_45px_rgba(0,0,0,0.6)] p-4 sm:p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm sm:text-base font-semibold">
                Coach Notes
              </h3>
              <p className="text-xs text-slate-400">
                Short reminders to keep you sharp
              </p>
            </div>
            <Clock className="w-5 h-5 text-emerald-400" />
          </div>

          <ul className="text-xs sm:text-sm text-slate-200 space-y-2 list-disc list-inside">
            <li>
              Front-load your protein earlier in the day to avoid rushing it at
              night.
            </li>
            <li>Keep at least one fruit and one veggie in your meals.</li>
            <li>
              If you miss a workout, do a 10–15 minute mobility or walk instead
              of doing nothing.
            </li>
            <li>
              Progress = calories, protein, sleep, and stress management
              working together.
            </li>
          </ul>
        </div>
      </section>
    </div>
    </>
  );
}

// -------------------- Sub Components --------------------

function OverviewCard({
  label,
  icon,
  value,
  note,
  progress,
  accent = "from-sky-400/60 to-indigo-500/70",
}) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-800">
            {icon}
          </span>
          <span className="font-semibold">{label}</span>
        </div>
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          Progress
        </span>
      </div>

      <div className="text-sm sm:text-base font-semibold text-slate-50">
        {value}
      </div>

      <div className="space-y-1">
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${accent} transition-all`}
            style={{ width: `${progress || 5}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-slate-400">
          <span>{note}</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}

function StreakRow({ label, days }) {
  const strong = days >= 5;
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2">
        <CheckCircle2
          className={`w-4 h-4 ${
            days > 0 ? "text-emerald-400" : "text-slate-600"
          }`}
        />
        <span className="text-slate-200">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        <span
          className={`px-2 py-0.5 rounded-full border text-[11px] ${
            strong
              ? "border-emerald-500 text-emerald-300 bg-emerald-950/60"
              : "border-slate-600 text-slate-200 bg-slate-900"
          }`}
        >
          {days} day{days !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

function QuickActionButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full inline-flex flex-col items-start justify-between gap-2 rounded-xl border border-slate-700 bg-slate-900/70 hover:bg-slate-800 hover:border-violet-500/70 px-3 py-2 transition text-left"
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 border border-slate-600">
          {icon}
        </span>
        <span className="text-[11px] font-medium text-slate-100">
          {label}
        </span>
      </div>
      <span className="text-[10px] text-slate-400 flex items-center gap-1">
        Go
        <ChevronRight className="w-3 h-3" />
      </span>
    </button>
  );
}

function ChecklistRow({ done, label }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <div
          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
            done
              ? "border-emerald-500 bg-emerald-900/60"
              : "border-slate-600 bg-slate-900"
          }`}
        >
          {done && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
        </div>
        <span
          className={`text-slate-200 text-xs sm:text-sm ${
            done ? "line-through text-slate-500" : ""
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
