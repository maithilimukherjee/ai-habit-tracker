import api from "./api";

/* -----------------------------
   MORNING MOTIVATION
------------------------------ */
export const getMorningMotivation = async () => {
  const token = localStorage.getItem("token");

  const response = await api.post(
    "/ai/morning",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

/* -----------------------------
   WEEKLY REPORT
------------------------------ */
export const getWeeklyReport = async () => {
  const token = localStorage.getItem("token");

  const response = await api.post(
    "/ai/weekly-report",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

/* -----------------------------
   SUGGEST IDEAS
------------------------------ */
export const suggestIdeas = async ({
  goals,
  productiveTime,
  struggles
}) => {
  const token = localStorage.getItem("token");

  const response = await api.post(
    "/ai/suggest-ideas",
    {
      goals,
      productiveTime,
      struggles
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

/* -----------------------------
   RECOVERY PLAN
------------------------------ */
export const getRecoveryPlan = async (habitId) => {
  const token = localStorage.getItem("token");

  const response = await api.post(
    "/ai/recovery-plan",
    { habitId },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

/* -----------------------------
   CHAT ANALYSIS
------------------------------ */
export const chatAnalysis = async (question) => {
  const token = localStorage.getItem("token");

  const response = await api.post(
    "/ai/chat",
    { question },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};