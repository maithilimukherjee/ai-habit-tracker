import api from "./api";

export const getTodayLogs = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get(
    "/logs/today",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

// 1. Add 'date' parameter and pass it in the POST body
export const markHabitComplete = async (habitId, date) => {
  const token = localStorage.getItem("token");
  const response = await api.post(
    "/logs/complete",
    { habitId, date }, 
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

// 2. Add 'date' parameter and pass it in the DELETE data payload
export const unmarkHabitComplete = async (habitId, date) => {
  const token = localStorage.getItem("token");
  const response = await api.delete(
    "/logs/complete",
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: { habitId, date } 
    }
  );
  return response.data;
};

export const getHabitStats = async (habitId) => {
  const token = localStorage.getItem("token");
  const response = await api.get(
    `/logs/stats/${habitId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const getHeatmapData = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get(
    "/logs/heatmap",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const getAllStats = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get(
    "/logs/stats",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};