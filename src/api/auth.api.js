import api from "./axios";

// 🔐 Login -> POST /api/login
export const login = (payload) => api.post("/login", payload);

// 👤 Get current logged-in user -> GET /api/me
export const getCurrentUser = () => api.get("/me");

// 🚪 Logout (frontend-only for JWT)
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};