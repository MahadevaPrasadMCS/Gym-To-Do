// frontend/src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://gym-to-do.onrender.com/api" || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("ft_user");
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return config;
});

export default api;
