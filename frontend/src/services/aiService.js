import api from "./api";

/* -----------------------------
   MORNING MOTIVATION
------------------------------ */
export const getMorningMotivation =
  async () => {

    const token =
      localStorage.getItem("token");

    const response =
      await api.post(
        "/ai/morning",
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    return response.data;

};

/* -----------------------------
   WEEKLY REPORT
------------------------------ */
export const getWeeklyReport =
  async () => {

    const token =
      localStorage.getItem("token");

    const response =
      await api.post(
        "/ai/weekly-report",
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    return response.data;

};