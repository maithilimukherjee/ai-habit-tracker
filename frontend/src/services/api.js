import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-habit-tracker-m4zd.onrender.com/api"
});

export default api;