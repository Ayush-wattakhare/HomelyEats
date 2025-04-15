// src/auth.js

// --- TOKEN HELPERS ---
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

// --- ROLE HELPERS ---
export const setUserRole = (role) => {
  localStorage.setItem("role", role);
};

export const getUserRole = () => {
  return localStorage.getItem("role");
};

export const removeUserRole = () => {
  localStorage.removeItem("role");
};

// --- CLEAR EVERYTHING ---
export const logout = () => {
  removeToken();
  removeUserRole();
};
