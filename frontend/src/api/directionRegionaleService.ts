// src/api/directionRegionaleService.ts
import api from "./api";

const BASE_URL = "/directions-regionales";

// Créer un objet service avec toutes les méthodes
export const directionRegionaleService = {
  // 🟢 Créer une direction régionale
  createDirection: async (data: any) => {
    const response = await api.post(BASE_URL, data);
    return response.data;
  },

  // 🟡 Récupérer toutes les directions régionales
  getAllDirections: async () => {
    const response = await api.get(BASE_URL);
    return response.data;
  },

  // 🟠 Récupérer une direction régionale par ID
  getDirectionById: async (id: number) => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // 🔵 Mettre à jour une direction régionale
  updateDirection: async (id: number, data: any) => {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // 🔴 Supprimer une direction régionale
  deleteDirection: async (id: number) => {
    await api.delete(`${BASE_URL}/${id}`);
  }
};

// ⭐ OPTIONNEL : Exporter aussi les fonctions individuelles pour la compatibilité
export const createDirectionRegionale = directionRegionaleService.createDirection;
export const getAllDirections = directionRegionaleService.getAllDirections;
export const getDirectionById = directionRegionaleService.getDirectionById;
export const updateDirection = directionRegionaleService.updateDirection;
export const deleteDirection = directionRegionaleService.deleteDirection;