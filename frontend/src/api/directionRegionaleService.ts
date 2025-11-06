// src/api/directionRegionaleService.ts
import api from "./api";

const BASE_URL = "/directions-regionales";

// 🟢 Créer une direction régionale
export const createDirectionRegionale = async (data: any) => {
  const response = await api.post(BASE_URL, data);
  return response.data;
};

// 🟡 Récupérer toutes les directions régionales
export const getAllDirections = async () => {
  const response = await api.get(BASE_URL);
  return response.data;
};

// 🟠 Récupérer une direction régionale par ID
export const getDirectionById = async (id: number) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};

// 🔴 Supprimer une direction régionale
export const deleteDirection = async (id: number) => {
  await api.delete(`${BASE_URL}/${id}`);
};
