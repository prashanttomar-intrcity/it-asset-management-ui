import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",  // 👈 include /api namespace
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 🔐 Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // token saved after login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Optional: global 401 handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // optional: redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;