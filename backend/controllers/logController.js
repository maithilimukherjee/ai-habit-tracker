import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";
import {
    last90Days,
    lastNDays,
    calcStreak,
    toDateKey
} from "../utils/dateHelpers.js";


const normalizeDate = (d = new Date()) => {
    const date = new Date(d);
    // Use local time instead of UTC to avoid rolling back the day
    date.setHours(0, 0, 0, 0); 
    return date;
};

/* -----------------------------
   MARK COMPLETE
------------------------------ */
export const markComplete = async (req, res) => {
    try {
        const { habitId, date, notes } = req.body;

        const completedDate = date
            ? normalizeDate(date)
            : normalizeDate();

        const habit = await Habit.findOne({
            _id: habitId,
            user: req.user._id
        });

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        const log = await HabitLog.findOneAndUpdate(
            {
                userId: req.user._id,
                habitId,
                completedDate
            },
            {
                $setOnInsert: {
                    userId: req.user._id,
                    habitId,
                    completedDate,
                    notes: notes || ""
                }
            },
            {
                upsert: true,
                new: true
            }
        );

        return res.status(201).json(log);

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};

/* -----------------------------
   UNMARK COMPLETE
------------------------------ */
export const unmarkComplete = async (req, res) => {

    try {

        const { habitId, date } = req.body;

        const completedDate = date
            ? normalizeDate(date)
            : normalizeDate();

        const deleted = await HabitLog.findOneAndDelete({
            userId: req.user._id,
            habitId,
            completedDate
        });

        return res.json({
            success: true,
            deleted: !!deleted
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};

/* -----------------------------
   GET TODAY LOGS
------------------------------ */
export const getToday = async (req, res) => {

    try {

        const today = normalizeDate();

        const logs = await HabitLog.find({
            userId: req.user._id,
            completedDate: today
        });

        return res.json({
            date: today,
            logs
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};

/* -----------------------------
   GET RANGE (last N days)
------------------------------ */
export const getRange = async (req, res) => {

    try {

        const { days = 7 } = req.query;

        const range = lastNDays(
            Number(days)
        ).map(normalizeDate);

        const logs = await HabitLog.find({
            userId: req.user._id,
            completedDate: { $in: range }
        });

        const grouped = {};

        for (const d of range) {

            grouped[d.toISOString()] = [];

        }

        for (const log of logs) {

            const key =
                new Date(
                    log.completedDate
                ).toISOString();

            grouped[key].push(log);

        }

        return res.json({
            range,
            data: grouped
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};

/* -----------------------------
   HEATMAP (last 90 days)
------------------------------ */
/* -----------------------------
   HEATMAP (last 90 days)
------------------------------ */
export const getHeatMap = async (req, res) => {
    try {
        const days = last90Days();

        const startDate = normalizeDate(new Date(days[0]));
        const endDate = normalizeDate(new Date(days[days.length - 1]));
        endDate.setHours(23, 59, 59, 999);

        // 1. Fetch only the active habits for this user
        const activeHabits = await Habit.find({ user: req.user._id }).select('_id');
        const activeHabitIds = activeHabits.map(h => h._id);

        // 2. Filter HabitLogs by active habit IDs
        const logs = await HabitLog.find({
            userId: req.user._id,
            habitId: { $in: activeHabitIds }, // Prevents deleted habits from glowing!
            completedDate: {
                $gte: startDate,
                $lte: endDate
            }
        });

        const counts = {};

        for (const d of days) {
            counts[toDateKey(new Date(d))] = 0;
        }

        for (const log of logs) {
            const key = toDateKey(new Date(log.completedDate));
            counts[key] = (counts[key] || 0) + 1;
        }

        return res.json(counts);

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

/* -----------------------------
   SINGLE HABIT STATS
------------------------------ */
export const getHabitStats = async (req, res) => {

    try {

        const habit = await Habit.findOne({
            _id: req.params.habitId,
            user: req.user._id
        });

        if (!habit) {

            return res.status(404).json({
                message: "Habit not found"
            });

        }

        const logs = await HabitLog.find({
            userId: req.user._id,
            habitId: habit._id
        });

        const dateKeys = logs.map(l =>
            toDateKey(
                new Date(l.completedDate)
            )
        );

        const { current, longest } =
            calcStreak(dateKeys);

        return res.json({
            totalCompletions: logs.length,
            currentStreak: current,
            longestStreak: longest
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};

/* -----------------------------
   ALL HABITS STATS
------------------------------ */
export const getAllStats = async (req, res) => {

    try {

        const habits = await Habit.find({
            user: req.user._id
        });

        const logs = await HabitLog.find({
            userId: req.user._id
        });

        const last30 = lastNDays(30).map(d =>
            toDateKey(
                new Date(d)
            )
        );

        const grouped = new Map();

        for (const log of logs) {

            const id =
                log.habitId.toString();

            if (!grouped.has(id)) {

                grouped.set(id, []);

            }

            grouped.get(id).push(log);

        }

        const perHabit = habits.map(h => {

            const hLogs =
                grouped.get(
                    h._id.toString()
                ) || [];

            const keys = hLogs.map(l =>
                toDateKey(
                    new Date(
                        l.completedDate
                    )
                )
            );

            const { current, longest } =
                calcStreak(keys);

            const completions30d =
                hLogs.filter(l =>
                    last30.includes(
                        toDateKey(
                            new Date(
                                l.completedDate
                            )
                        )
                    )
                ).length;

            return {
                habitId: h._id,
                name: h.name,
                icon: h.icon,
                color: h.color,
                category: h.category,
                completions30d,
                currentStreak: current,
                longestStreak: longest
            };

        });

        return res.json({
            perHabit,
            days: last90Days()
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};