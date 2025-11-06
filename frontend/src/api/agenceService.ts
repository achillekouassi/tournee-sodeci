// src/api/agenceService.ts
import api from "./api";

const BASE_URL = "/agences";

// 🟢 Créer une agence
export const createAgence = async (data: any) => {
  const response = await api.post(BASE_URL, data);
  return response.data;
};

// 🟡 Modifier une agence
export const updateAgence = async (id: number, data: any) => {
  const response = await api.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

// 🟠 Récupérer une agence par ID
export const getAgenceById = async (id: number) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};

// 🟣 Récupérer toutes les agences
export const getAllAgences = async () => {
  const response = await api.get(BASE_URL);
  return response.data;
};

// 🟤 Récupérer les agences paginées
export const getAgencesPaginated = async (page: number, size: number) => {
  const response = await api.get(`${BASE_URL}/paginated`, {
    params: { page, size },
  });
  return response.data;
};

// 🔵 Récupérer les agences actives
export const getActiveAgences = async () => {
  const response = await api.get(`${BASE_URL}/active`);
  return response.data;
};

// ⚪ Récupérer une agence par code
export const getAgenceByCode = async (code: string) => {
  const response = await api.get(`${BASE_URL}/code/${code}`);
  return response.data;
};

// 🟢 Récupérer les agences par ID de direction régionale
export const getAgencesByDirectionRegionale = async (drId: number) => {
  const response = await api.get(`${BASE_URL}/direction-regionale/${drId}`);
  return response.data;
};

// 🟢 Récupérer les agences par code de direction régionale
export const getAgencesByDirectionRegionaleCode = async (drCode: string) => {
  const response = await api.get(`${BASE_URL}/direction-regionale/code/${drCode}`);
  return response.data;
};

// 🟠 Rechercher par libellé
export const searchAgencesByLibelle = async (libelle: string) => {
  const response = await api.get(`${BASE_URL}/search`, {
    params: { libelle },
  });
  return response.data;
};

// 🔴 Compter les agents d’une agence
export const countAgentsInAgence = async (id: number) => {
  const response = await api.get(`${BASE_URL}/${id}/count-agents`);
  return response.data;
};

// ⚫ Supprimer une agence
export const deleteAgence = async (id: number) => {
  await api.delete(`${BASE_URL}/${id}`);
};

// 🟣 Désactiver une agence
export const deactivateAgence = async (id: number) => {
  await api.patch(`${BASE_URL}/${id}/deactivate`);
};
