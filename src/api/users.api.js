import api from "./axios";

export const getUsers = () => api.get("/users");

export const createUser = (payload) => api.post("/users", { user: payload });
export const deleteUser = (id) => api.delete(`/users/${id}`);