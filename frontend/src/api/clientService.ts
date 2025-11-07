// src/api/clientService.ts
import { ClientDTO } from "../types/ClientDTO";
import api from "./api";


const BASE_URL = "/clients";

// Exportez un objet service avec toutes les méthodes
export const clientService = {
  // 🟢 Créer un client
  createClient: async (data: ClientDTO) => {
    const response = await api.post(BASE_URL, data);
    return response.data;
  },

  // 🟡 Modifier un client
  updateClient: async (id: number, data: ClientDTO) => {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // 🔵 Récupérer un client par ID
  getClientById: async (id: number) => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // 🟣 Récupérer tous les clients
  getAllClients: async () => {
    const response = await api.get(BASE_URL);
    return response.data;
  },

  // 📄 Récupérer les clients paginés
  getPaginatedClients: async (page: number = 0, size: number = 10) => {
    const response = await api.get(`${BASE_URL}/paginated?page=${page}&size=${size}`);
    return response.data;
  },

  // ✅ Récupérer les clients actifs
  getActiveClients: async () => {
    const response = await api.get(`${BASE_URL}/active`);
    return response.data;
  },

  // 🔍 Rechercher par référence contrat
  getClientByReferenceContrat: async (referenceContrat: string) => {
    const response = await api.get(`${BASE_URL}/reference-contrat/${referenceContrat}`);
    return response.data;
  },

  // 🏢 Récupérer les clients d'une agence
  getClientsByAgence: async (agenceId: number) => {
    const response = await api.get(`${BASE_URL}/agence/${agenceId}`);
    return response.data;
  },

  // 🏢 Récupérer les clients par code agence
  getClientsByCodeAgence: async (codeAgence: string) => {
    const response = await api.get(`${BASE_URL}/code-agence/${codeAgence}`);
    return response.data;
  },

  // 💳 Récupérer les clients par groupe de facturation
  getClientsByGroupeFacturation: async (gf: string) => {
    const response = await api.get(`${BASE_URL}/groupe-facturation/${gf}`);
    return response.data;
  },

  // 🔎 Rechercher des clients par nom
  searchClientsByNom: async (nom: string) => {
    const response = await api.get(`${BASE_URL}/search?nom=${encodeURIComponent(nom)}`);
    return response.data;
  },

  // ☎️ Rechercher des clients par téléphone
  getClientsByTelephone: async (telephone: string) => {
    const response = await api.get(`${BASE_URL}/telephone/${telephone}`);
    return response.data;
  },

  // 💰 Récupérer les clients débiteurs
  getClientsWithDebt: async () => {
    const response = await api.get(`${BASE_URL}/with-debt`);
    return response.data;
  },

  // 💸 Récupérer les clients débiteurs d'une agence
  getClientsWithDebtByAgence: async (codeAgence: string) => {
    const response = await api.get(`${BASE_URL}/with-debt/agence/${codeAgence}`);
    return response.data;
  },

  // 🏦 Mettre à jour le solde compte
  updateSoldeCompte: async (id: number, montant: number) => {
    const response = await api.put(`${BASE_URL}/${id}/solde?montant=${montant}`);
    return response.data;
  },

  // 💵 Mettre à jour le montant dû
  updateMontantDu: async (id: number, montant: number) => {
    const response = await api.put(`${BASE_URL}/${id}/montant-du?montant=${montant}`);
    return response.data;
  },

  // 📊 Statistiques - nombre de clients par agence
  countClientsByAgence: async (codeAgence: string) => {
    const response = await api.get(`${BASE_URL}/statistics/count-by-agence/${codeAgence}`);
    return response.data;
  },

  // 📈 Statistiques - somme des montants dus par agence
  sumMontantDuByAgence: async (codeAgence: string) => {
    const response = await api.get(`${BASE_URL}/statistics/sum-montant-du/${codeAgence}`);
    return response.data;
  },

  // 🚫 Désactiver un client
  deactivateClient: async (id: number) => {
    const response = await api.patch(`${BASE_URL}/${id}/deactivate`);
    return response.data;
  },

  // 🗑️ Supprimer un client
  deleteClient: async (id: number) => {
    await api.delete(`${BASE_URL}/${id}`);
  }
};