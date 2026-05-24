import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";
import AIInsights from "../models/AIInsights.js";
import {
    chatCompletion,
    SYSTEM_PROMPTS,
    parseJSON
} from "../utils/aiService.js";
import {
    lastNDays,
    calcStreak
} from "../utils/dateHelpers.js";

/* -----------------------------
   HELPERS
------------------------------ */
const normalizeDate = (d = new Date()) => {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    return date;
};

const buildWeeklyContext = async (userId) => {
    const habits = await Habit.find({
        user: userId,
        isArchived: false
    });

    const dayKeys = lastNDays(7);

    const start = normalizeDate(dayKeys[0]);
    const end = normalizeDate(dayKeys[dayKeys.length - 1]);
    end.setHours(23, 59, 59, 999);

    const logs = await HabitLog.find({
        userId,
        completedDate: {
            $gte: start,
            $lte: end
        }
    });

    const grouped = new Map();

    for (const log of logs) {
        const id = String(log.habitId);
        grouped.set(id, (grouped.get(id) || 0) + 1);
    }

    const perHabit = habits.map((h) => ({
        name: h.name,
        category: h.category,
        frequency: h.frequency,
        completedDays: grouped.get(String(h._id)) || 0,
        targetDays: h.targetDays
    }));

    return {
        days: dayKeys,
        perHabit
    };
};

/* -----------------------------
   1. WEEKLY REPORT
------------------------------ */
export const weeklyReport = async (req, res) => {
    try {
        const ctx = await buildWeeklyContext(req.user._id);

        if (!ctx.perHabit.length) {
            return res.json({
                content:
                    "You don't have any active habits yet. Create your first habit to start tracking."
            });
        }

        const userMsg =
            `Here is the user's habit data for the last 7 days (${ctx.days[0]} to ${ctx.days[6]}):\n\n` +
            ctx.perHabit
                .map(
                    (h) => `Habit: ${h.name}
Category: ${h.category}
Frequency: ${h.frequency}
Completed: ${h.completedDays}/${h.targetDays}`
                )
                .join("\n\n");

        const ai = await chatCompletion({
            system: SYSTEM_PROMPTS.weekly,
            user: userMsg,
            temperature: 0.7
        });

        if (!ai.ok) {
            return res.status(500).json({
                message: ai.content
            });
        }

        await AIInsights.create({
            userId: req.user._id,
            type: "weekly",
            content: ai.content,
            meta: {
                startDate: ctx.days[0],
                endDate: ctx.days[6],
                habitsAnalyzed: ctx.perHabit.length
            }
        });

        return res.json({
            content: ai.content
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

/* -----------------------------
   2. HABIT SUGGESTIONS
------------------------------ */
export const suggestIdeas = async (req, res) => {
    try {
        const {
            goals = [],
            productiveTime = "",
            struggles = []
        } = req.body;

        if (!goals.length) {
            return res.status(400).json({
                message: "At least one goal is required"
            });
        }

        const userMsg = `
User goals: ${goals.join(", ")}
Most productive time: ${productiveTime || "not specified"}
Past struggles: ${struggles.length ? struggles.join(", ") : "none provided"}

Suggest 3 personalised habits based on the above parameters.

Return STRICT JSON ONLY. Do not include markdown formatting (like \`\`\`json) or any conversational text.
Your response must be a JSON array of objects using this exact structure:

[
  {
    "title": "Short, catchy habit name",
    "description": "1-2 practical sentences explaining exactly how and when to do it.",
    "category": "focus" 
  }
]
`;

        const ai = await chatCompletion({
            system: SYSTEM_PROMPTS.suggestion,
            user: userMsg,
            temperature: 0.8
        });

        if (!ai.ok) {
            return res.status(500).json({
                message: ai.content
            });
        }

        const suggestions = parseJSON(ai.content);

        await AIInsights.create({
            userId: req.user._id,
            type: "suggestion",
            content: JSON.stringify(suggestions),
            meta: {
                goals,
                productiveTime,
                struggles
            }
        });

        return res.json({
            suggestions
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

/* -----------------------------
   3. STREAK RECOVERY
------------------------------ */
export const recoveryPlan = async (req, res) => {
    try {
        const { habitId } = req.body;

        const habit = await Habit.findOne({
            _id: habitId,
            user: req.user._id
        });

        if (!habit) {
            return res.status(404).json({
                message: "Habit not found"
            });
        }

        const logs = await HabitLog.find({
            userId: req.user._id,
            habitId
        }).sort({ completedDate: -1 });

        const keys = logs.map((l) =>
            new Date(l.completedDate).toISOString().split("T")[0]
        );

        const { current, longest } = calcStreak(keys);

        if (current > 0) {
            return res.json({
                content:
                    "Your streak is still active — no recovery plan needed right now. Keep going!"
            });
        }

        const lastCompleted =
            logs.length > 0
                ? new Date(logs[0].completedDate)
                      .toISOString()
                      .split("T")[0]
                : "never";

        const userMsg = `
Habit: ${habit.name}
Category: ${habit.category}
Longest streak: ${longest}
Current streak: ${current}
Last completed: ${lastCompleted}

The user has broken this habit streak.
Create a personalised 3-day comeback plan.
`;

        const ai = await chatCompletion({
            system: SYSTEM_PROMPTS.recovery,
            user: userMsg,
            temperature: 0.7
        });

        if (!ai.ok) {
            return res.status(500).json({
                message: ai.content
            });
        }

        await AIInsights.create({
            userId: req.user._id,
            type: "recovery",
            content: ai.content,
            meta: {
                habitId,
                habitName: habit.name,
                longestStreak: longest
            }
        });

        return res.json({
            content: ai.content
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

/* -----------------------------
   4. HABIT ANALYSIS CHAT
------------------------------ */
export const chatAnalysis = async (req, res) => {
    try {
        const { question } = req.body;

        const trimmedQuestion = question?.trim();

        if (!trimmedQuestion) {
            return res.status(400).json({
                message: "Question is required"
            });
        }

        const habits = await Habit.find({
            user: req.user._id,
            isArchived: false
        });

        const days = lastNDays(30);

        const start = normalizeDate(days[0]);
        const end = normalizeDate(days[days.length - 1]);
        end.setHours(23, 59, 59, 999);

        const logs = await HabitLog.find({
            userId: req.user._id,
            completedDate: {
                $gte: start,
                $lte: end
            }
        });

        const context = habits
            .map((h) => {
                const hLogs = logs.filter(
                    (l) => String(l.habitId) === String(h._id)
                );

                const byDow = [0, 0, 0, 0, 0, 0, 0];

                for (const l of hLogs) {
                    const dow = new Date(l.completedDate).getDay();
                    byDow[dow] += 1;
                }

                return `${h.name} (${h.category}): ${hLogs.length}/30 completions in the last 30 days, by weekday [Sun-Sat]: ${byDow.join(", ")}`;
            })
            .join("\n");

        const userMsg = `
User question:
${trimmedQuestion}

Habit data:
${context}
`;

        const ai = await chatCompletion({
            system: SYSTEM_PROMPTS.chat,
            user: userMsg,
            temperature: 0.4
        });

        if (!ai.ok) {
            return res.status(500).json({
                message: ai.content
            });
        }

        await AIInsights.create({
            userId: req.user._id,
            type: "chat",
            content: ai.content,
            meta: {
                question: trimmedQuestion
            }
        });

        return res.json({
            answer: ai.content
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

/* -----------------------------
   5. MORNING MOTIVATION
------------------------------ */
export const morningMotivation = async (req, res) => {
    try {
        const habits = await Habit.find({
            user: req.user._id,
            isArchived: false
        });

        if (!habits.length) {
            return res.json({
                content:
                    "Good morning! Start small today — create your first habit and begin your streak."
            });
        }

        const logs = await HabitLog.find({
            userId: req.user._id
        }).select("habitId completedDate");

        const grouped = new Map();

        for (const log of logs) {
            const id = String(log.habitId);

            if (!grouped.has(id)) grouped.set(id, []);

            grouped.get(id).push(
                new Date(log.completedDate)
                    .toISOString()
                    .split("T")[0]
            );
        }

        const habitSummary = habits.map((h) => {
            const keys = grouped.get(String(h._id)) || [];
            const { current } = calcStreak(keys);

            return {
                name: h.name,
                currentStreak: current
            };
        });

        const userMsg =
            "Generate a personalised morning motivation using these habits:\n\n" +
            habitSummary
                .map(
                    (h) =>
                        `${h.name}: current streak ${h.currentStreak}`
                )
                .join("\n");

        const ai = await chatCompletion({
            system: SYSTEM_PROMPTS.morning,
            user: userMsg,
            temperature: 0.9
        });

        if (!ai.ok) {
            return res.status(500).json({
                message: ai.content
            });
        }

        await AIInsights.create({
            userId: req.user._id,
            type: "morning",
            content: ai.content,
            meta: {
                habits: habitSummary.length
            }
        });

        return res.json({
            content: ai.content
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};