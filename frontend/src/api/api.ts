// src/api/api.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api"; // URL racine de ton backend

// Création d'une instance Axios réutilisable
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optionnel : intercepteur pour ajouter le token automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // si tu stockes le token JWT dans le localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
