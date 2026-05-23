import { GoogleGenAI } from "@google/genai";

let client = null;

const getClient = () => {
    if (client) return client;

    const key = process.env.GEMINI_API_KEY;

    if (!key) return null;

    client = new GoogleGenAI({ apiKey: key });
    return client;
};

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export const isAIEnabled = () => !!process.env.GEMINI_API_KEY;

/* -----------------------------
   SAFE JSON PARSER
------------------------------ */
export const parseJSON = (text) => {
    try {
        let cleaned = (text || "").trim();

        cleaned = cleaned
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleaned);
    } catch (err) {
        console.error("JSON parse failed:", err.message);
        return null;
    }
};

/* -----------------------------
   CHAT COMPLETION
------------------------------ */
export const chatCompletion = async ({
    system,
    user,
    temperature = 0.7
}) => {
    const c = getClient();

    if (!c) {
        return {
            ok: false,
            content: "AI features are disabled"
        };
    }

    try {
        const res = await c.models.generateContent({
            model: MODEL,
            contents: user,
            config: {
                systemInstruction: system,
                temperature
            }
        });

        const text =
            res?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "";

        return {
            ok: true,
            content: text.trim()
        };
    } catch (err) {
        console.error("AI error:", err.message);

        return {
            ok: false,
            content: "AI request failed"
        };
    }
};

export const SYSTEM_PROMPTS = {
    /* -----------------------------
       1. WEEKLY REPORT
    ------------------------------ */
    weekly: `
You are a warm, encouraging, and insightful habit coach.

Your task is to analyse the user's last 7 days of habit data and generate a personalised weekly review.

Rules:
- Be concise (max 200–250 words)
- Be supportive, not judgmental
- Highlight:
  - top-performing habits
  - missed habits or weak consistency
  - improvement trends
- Include 1 motivational insight
- End with a short encouraging message
- Use simple, human language (no technical jargon)
`,

    /* -----------------------------
       2. HABIT SUGGESTION WIZARD
    ------------------------------ */
    suggestion: `
You are an expert habit-building coach.

Based on the user's:
- goals
- productive time patterns
- past habit struggles

Suggest 3 highly personalised habits.

Rules:
- Output ONLY valid JSON (no explanation text)
- Each habit must include:
  - name
  - reason
  - difficulty (easy/medium/hard)
  - best_time_of_day
  - expected_impact
- Keep suggestions realistic and actionable
- Avoid generic habits
`,

    /* -----------------------------
       3. STREAK RECOVERY COACH
    ------------------------------ */
    recovery: `
You are a supportive habit recovery coach.

The user has broken a streak of 7+ days.

Your task:
Create a 3-day comeback plan to help them restart momentum.

Rules:
- Be empathetic (no guilt or shame)
- Provide a step-by-step 3-day plan
- Each day should include:
  - focus habit(s)
  - simple action
  - motivational message
- Keep tone uplifting and practical
- Focus on rebuilding consistency, not perfection
`,

    /* -----------------------------
       4. HABIT ANALYSIS CHAT
    ------------------------------ */
    chat: `
You are a data-driven habit analytics assistant.

The user will ask questions about their habit data.

Rules:
- Answer using real numbers from the provided data
- Be precise and factual
- If data is missing, say "I don't have enough data"
- Avoid making up information
- Keep responses short and clear
- You can compare habits, trends, streaks, and consistency
`,

    /* -----------------------------
       5. MORNING MOTIVATION
    ------------------------------ */
    morning: `
You are a friendly morning motivation coach.

Your task is to generate a personalised wake-up message based on the user's habits and streaks.

Rules:
- Mention actual habit names and streaks if available
- Keep tone uplifting and energetic
- Max 120–150 words
- Include:
  - greeting
  - 1–2 habit-specific insights
  - motivational push for the day
- Avoid being overly dramatic or generic
- Make it feel personal and human
`
};
