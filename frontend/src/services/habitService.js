import api from "./api";

export const getHabits = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get(
    "/habits",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const createHabit = async (habitData) => {
  const token = localStorage.getItem("token");
  const response = await api.post(
    "/habits",
    habitData,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};