import Habit from "../models/Habit";
import HabitLog from "../models/HabitLog";
import { todayKey, last90Days } from "../utils/dateHelpers";

export const markComplete = async (req, res) => {
    try {
        const { habitId, date } = req.body;

        const completedDate = date || todayKey();

        const habit = await Habit.findOne({
            _id: habitId,
            user: req.user._id
        });

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        const log = await HabitLog.findOneAndUpdate(
            {
                user: req.user._id,
                habit: habitId,
                completedDate
            },
            {
                $setOnInsert: {
                    user: req.user._id,
                    habit: habitId,
                    completedDate
                }
            },
            {
                upsert: true,
                new: true
            }
        );

        return res.status(201).json(log);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getHeatMap = async (req, res) => {
    try {
        const days = last90Days();

        const logs = await HabitLog.find({
            user: req.user._id,
            completedDate: { $in: days }
        }).select("completedDate -_id");

        const counts = {};

        for (const d of days) {
            counts[d] = 0;
        }

        for (const log of logs) {
            counts[log.completedDate] =
                (counts[log.completedDate] || 0) + 1;
        }

        return res.status(200).json(counts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};