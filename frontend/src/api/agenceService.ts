// src/api/agenceService.ts
import api from "./api";

const BASE_URL = "/agences";

// Exportez un objet service avec toutes les méthodes
export const agenceService = {
  // 🟢 Créer une agence
  createAgence: async (data: any) => {
    const response = await api.post(BASE_URL, data);
    return response.data;
  },

  // 🟡 Modifier une agence
  updateAgence: async (id: number, data: any) => {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // 🟠 Récupérer une agence par ID
  getAgenceById: async (id: number) => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // 🟣 Récupérer toutes les agences
  getAllAgences: async () => {
    const response = await api.get(BASE_URL);
    return response.data;
  },

  // 🟤 Récupérer les agences paginées
  getAgencesPaginated: async (page: number, size: number) => {
    const response = await api.get(`${BASE_URL}/paginated`, {
      params: { page, size },
    });
    return response.data;
  },

  // 🔵 Récupérer les agences actives
  getActiveAgences: async () => {
    const response = await api.get(`${BASE_URL}/active`);
    return response.data;
  },

  // ⚪ Récupérer une agence par code
  getAgenceByCode: async (code: string) => {
    const response = await api.get(`${BASE_URL}/code/${code}`);
    return response.data;
  },

  // 🟢 Récupérer les agences par ID de direction régionale
  getAgencesByDirectionRegionale: async (drId: number) => {
    const response = await api.get(`${BASE_URL}/direction-regionale/${drId}`);
    return response.data;
  },

  // 🟢 Récupérer les agences par code de direction régionale
  getAgencesByDirectionRegionaleCode: async (drCode: string) => {
    const response = await api.get(`${BASE_URL}/direction-regionale/code/${drCode}`);
    return response.data;
  },

  // 🟠 Rechercher par libellé
  searchAgencesByLibelle: async (libelle: string) => {
    const response = await api.get(`${BASE_URL}/search`, {
      params: { libelle },
    });
    return response.data;
  },

  // 🔴 Compter les agents d'une agence
  countAgentsInAgence: async (id: number) => {
    const response = await api.get(`${BASE_URL}/${id}/count-agents`);
    return response.data;
  },

  // ⚫ Supprimer une agence
  deleteAgence: async (id: number) => {
    await api.delete(`${BASE_URL}/${id}`);
  },

  // 🟣 Désactiver une agence
  deactivateAgence: async (id: number) => {
    await api.patch(`${BASE_URL}/${id}/deactivate`);
  }
};