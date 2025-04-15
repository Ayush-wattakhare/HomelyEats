import axios from "axios";
import { getToken } from "./auth"; // ✅ Reuse auth logic

const API = axios.create({
  baseURL: "http://localhost:5000/api", // or your deployed URL
});

API.interceptors.request.use((req) => {
  const token = getToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const registerUser = async (userData) => {
  try {
    const response = await API.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("Registration Error:", error.response?.data || error.message);
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await API.post("/auth/login", userData);
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
};

export default API;
