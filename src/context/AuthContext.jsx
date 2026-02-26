import { createContext, useEffect, useState } from "react";
import { getCurrentUser, login as loginApi, logout as logoutApi } from "../api/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await getCurrentUser();
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();   // auto-login if token exists
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (data) => {
    const res = await loginApi(data);

    const { token, user } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);
    return user;
  };

  const logout = () => {
    logoutApi(); // clears localStorage (frontend-only)
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};