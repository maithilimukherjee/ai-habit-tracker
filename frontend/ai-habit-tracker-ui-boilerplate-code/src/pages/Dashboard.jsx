import { useEffect, useMemo, useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import api from "../api/axios.js";
import Modal from "../components/Modal.jsx";
import HabitForm from "../components/HabitForm.jsx";
import TodayHabitCard from "../components/TodayHabitCard.jsx";
import WeeklyGrid from "../components/WeeklyGrid.jsx";
import HeatmapChart from "../components/HeatmapChart.jsx";
import SummaryCards from "../components/SummaryCards.jsx";
import AIWeeklyReport from "../components/AIWeeklyReport.jsx";
import MorningMotivation from "../components/MorningMotivation.jsx";
import HabitSuggestionModal from "../components/HabitSuggestionModal.jsx";
import StreakRecoveryCard from "../components/StreakRecoveryCard.jsx";
import ProgressRing from "../components/ProgressRing.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { celebrate, celebrateBig } from "../utils/confetti.js";
import { streakFromKeys, todayKey } from "../utils/dateHelpers.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();

  const [habits, setHabits] = useState([]);
  const [todayLogs, setTodayLogs] = useState([]);
  const [weekLogs, setWeekLogs] = useState([]);
  const [heatmap, setHeatmap] = useState({});
  const [allLogsByHabit, setAllLogsByHabit] = useState({});
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [suggestOpen, setSuggestOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [recoveryHabit, setRecoveryHabit] = useState(null);

  // ---------------- LOAD DATA ----------------
  const loadAll = async () => {
    setLoading(true);

    try {
      const [habitsRes, todayRes, rangeRes, heatRes] =
        await Promise.all([
          api.get("/habits"),
          api.get("/logs/today"),
          api.get("/logs/range", { params: { days: 7 } }),
          api.get("/logs/heatmap"),
        ]);

      const habitsData = habitsRes.data || [];
      setHabits(habitsData);

      // FIX 1: today logs
      setTodayLogs(todayRes.data?.logs || []);

      // FIX 2: range logs object -> array
      setWeekLogs(
        Object.values(rangeRes.data?.data || {}).flat()
      );

      // FIX 3: heatmap object safe
      setHeatmap(heatRes.data || {});

      // ---------------- 90 DAYS ----------------
      const allRange = await api.get("/logs/range", {
        params: { days: 90 },
      });

      const allLogs = Object.values(allRange.data?.data || {}).flat();

      const byId = {};

      for (const h of habitsData) {
        byId[h._id] = [];
      }

      for (const l of allLogs) {
        const id = l.habitId || l.habit;
        if (!byId[id]) byId[id] = [];
        byId[id].push(l.completedDate);
      }

      for (const k of Object.keys(byId)) {
        byId[k] = byId[k].sort().reverse();
      }

      setAllLogsByHabit(byId);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // ---------------- TODAY SET ----------------
  const completedToday = useMemo(
    () =>
      new Set(
        todayLogs.map((l) => String(l.habitId || l.habit))
      ),
    [todayLogs]
  );

  // ---------------- WEEK GROUP ----------------
  const weekLogsByHabit = useMemo(() => {
    const out = {};
    for (const l of weekLogs) {
      const id = l.habitId || l.habit;
      if (!out[id]) out[id] = [];
      out[id].push(l.completedDate);
    }
    return out;
  }, [weekLogs]);

  // ---------------- STREAKS ----------------
  const streaksById = useMemo(() => {
    const out = {};
    for (const h of habits) {
      out[h._id] = streakFromKeys(
        allLogsByHabit[h._id] || []
      );
    }
    return out;
  }, [habits, allLogsByHabit]);

  const todayProgress = habits.length
    ? Math.round(
        (completedToday.size / habits.length) * 100
      )
    : 0;

  const activeStreaks = Object.values(streaksById).filter(
    (s) => s.current > 0
  ).length;

  const bestStreak = Math.max(
    0,
    ...Object.values(streaksById).map((s) => s.longest || 0)
  );

  const weekTotal = habits.length * 7;
  const weekDone = Object.values(weekLogsByHabit).reduce(
    (s, arr) => s + arr.length,
    0
  );

  const weekRate = weekTotal
    ? Math.round((weekDone / weekTotal) * 100)
    : 0;

  // ---------------- RECOVERY ----------------
  useEffect(() => {
    if (recoveryHabit || !habits.length) return;

    const dismissed = JSON.parse(
      localStorage.getItem("recovery-dismissed") || "{}"
    );

    for (const h of habits) {
      const s = streaksById[h._id];
      if (!s) continue;

      if (
        s.longest >= 7 &&
        s.current === 0 &&
        !dismissed[h._id]
      ) {
        setRecoveryHabit(h);
        return;
      }
    }
  }, [habits, streaksById, recoveryHabit]);

  // ---------------- SAVE / CREATE HABIT ----------------
  const save = async (data) => {
    setSubmitting(true);
    try {
      if (editing) {
        const res = await api.put(`/habits/${editing._id}`, data);
        const updatedHabit = res.data?.data || res.data;
        setHabits((hs) => hs.map((h) => (h._id === updatedHabit._id ? updatedHabit : h)));
      } else {
        const res = await api.post("/habits", data);
        const newHabit = res.data?.data || res.data;
        setHabits((hs) => [...hs, newHabit]);
        setAllLogsByHabit((p) => ({ ...p, [newHabit._id]: [] }));
      }
      setFormOpen(false);
      setEditing(null);
    } catch (err) {
      console.error("Error creating/saving habit from dashboard:", err?.response?.data || err);
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------- TOGGLE ----------------
  const toggle = async (habit) => {
    const done = completedToday.has(String(habit._id));
    const today = todayKey();

    if (done) {
      await api.delete("/logs", {
        data: { habitId: habit._id, date: today },
      });

      setTodayLogs((logs) =>
        logs.filter(
          (l) => String(l.habitId) !== String(habit._id)
        )
      );
    } else {
      const res = await api.post("/logs", {
        habitId: habit._id,
        date: today,
      });

      setTodayLogs((logs) => [...logs, res.data]);

      celebrate();

      setTimeout(() => {
        if (completedToday.size + 1 === habits.length) {
          celebrateBig();
        }
      }, 150);
    }
  };

  // ---------------- LOADING ----------------
  if (loading) return <LoadingSpinner full />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          Hey {user?.name?.split(" ")[0]} 👋
        </h1>

        <button
          className="btn-primary"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus size={14} /> New habit
        </button>
      </div>

      <MorningMotivation />

      <SummaryCards
        totalHabits={habits.length}
        activeStreaks={activeStreaks}
        bestStreak={bestStreak}
        weekRate={weekRate}
      />

      <div className="card p-5">
        <div className="flex justify-between mb-3">
          <div>
            <div className="font-medium">
              Today's habits
            </div>
            <div className="text-xs text-muted">
              {completedToday.size} / {habits.length}
            </div>
          </div>

          <ProgressRing
            value={todayProgress}
            size={52}
            stroke={5}
          />
        </div>

        {habits.map((h) => (
          <TodayHabitCard
            key={h._id}
            habit={h}
            completed={completedToday.has(
              String(h._id)
            )}
            streak={
              streaksById[h._id]?.current || 0
            }
            onToggle={() => toggle(h)}
          />
        ))}
      </div>

      <AIWeeklyReport />

      <WeeklyGrid
        habits={habits}
        logsByHabit={weekLogsByHabit}
      />

      {/* FIXED HEATMAP FORMATTING */}
      <HeatmapChart
        data={Object.entries(heatmap || {}).map(([date, count]) => ({
          date,
          count,
        }))}
      />

      <Modal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit habit" : "New habit"}
      >
        <HabitForm 
          initial={editing}
          submitting={submitting}
          onCancel={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSubmit={save} 
        />
      </Modal>

      <HabitSuggestionModal
        open={suggestOpen}
        onClose={() => setSuggestOpen(false)}
      />
    </div>
  );
}