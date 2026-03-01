import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

// Reuse token like your other APIs
const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getDashboard = async () => {
  return axios.get(`${BASE_URL}/dashboard`, {
    headers: authHeader(),
  });
};