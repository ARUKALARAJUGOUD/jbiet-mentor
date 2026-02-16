
import axios from "axios";

// const API = process.env.REACT_APP_API_URL;

const api = axios.create({
  // baseURL: "http://localhost:5000",
  // baseURL: "http://192.168.1.150:5000",
  // baseURL: "/api",
  baseURL: "https://jbiet-mentor.onrender.com",
  withCredentials: true,
});

// 🔹 Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔹 Handle 401 errors safely
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // If no response (network error), just reject
    if (!error.response) {
      return Promise.reject(error);
    }

    // 🔥 Prevent refresh loop
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;

      try {
        const refreshRes = await api.get("/auth/refresh");

        const newToken = refreshRes.data.accessToken;

        // Save new token
        localStorage.setItem("accessToken", newToken);

        // Update header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // 🔥 If refresh fails → logout user completely
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
