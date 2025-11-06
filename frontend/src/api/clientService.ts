// src/api/clientService.ts
import api from "./api";

const BASE_URL = "/clients";

// 🟢 Créer un client
export const createClient = (data) => api.post(BASE_URL, data);

// 🟡 Modifier un client
export const updateClient = (id, data) => api.put(`${BASE_URL}/${id}`, data);

// 🔵 Récupérer un client par ID
export const getClientById = (id) => api.get(`${BASE_URL}/${id}`);

// 🟣 Récupérer tous les clients
export const getAllClients = () => api.get(BASE_URL);

// 📄 Récupérer les clients paginés
export const getPaginatedClients = (page = 0, size = 10) =>
  api.get(`${BASE_URL}/paginated?page=${page}&size=${size}`);

// ✅ Récupérer les clients actifs
export const getActiveClients = () => api.get(`${BASE_URL}/active`);

// 🔍 Rechercher par référence contrat
export const getClientByReferenceContrat = (referenceContrat) =>
  api.get(`${BASE_URL}/reference-contrat/${referenceContrat}`);

// 🏢 Récupérer les clients d’une agence
export const getClientsByAgence = (agenceId) => api.get(`${BASE_URL}/agence/${agenceId}`);

// 🏢 Récupérer les clients par code agence
export const getClientsByCodeAgence = (codeAgence) =>
  api.get(`${BASE_URL}/code-agence/${codeAgence}`);

// 💳 Récupérer les clients par groupe de facturation
export const getClientsByGroupeFacturation = (gf) =>
  api.get(`${BASE_URL}/groupe-facturation/${gf}`);

// 🔎 Rechercher des clients par nom
export const searchClientsByNom = (nom) =>
  api.get(`${BASE_URL}/search?nom=${encodeURIComponent(nom)}`);

// ☎️ Rechercher des clients par téléphone
export const getClientsByTelephone = (telephone) =>
  api.get(`${BASE_URL}/telephone/${telephone}`);

// 💰 Récupérer les clients débiteurs
export const getClientsWithDebt = () => api.get(`${BASE_URL}/with-debt`);

// 💸 Récupérer les clients débiteurs d'une agence
export const getClientsWithDebtByAgence = (codeAgence) =>
  api.get(`${BASE_URL}/with-debt/agence/${codeAgence}`);

// 🏦 Mettre à jour le solde compte
export const updateSoldeCompte = (id, montant) =>
  api.put(`${BASE_URL}/${id}/solde?montant=${montant}`);

// 💵 Mettre à jour le montant dû
export const updateMontantDu = (id, montant) =>
  api.put(`${BASE_URL}/${id}/montant-du?montant=${montant}`);

// 📊 Statistiques - nombre de clients par agence
export const countClientsByAgence = (codeAgence) =>
  api.get(`${BASE_URL}/statistics/count-by-agence/${codeAgence}`);

// 📈 Statistiques - somme des montants dus par agence
export const sumMontantDuByAgence = (codeAgence) =>
  api.get(`${BASE_URL}/statistics/sum-montant-du/${codeAgence}`);

// 🚫 Désactiver un client
export const deactivateClient = (id) => api.patch(`${BASE_URL}/${id}/deactivate`);

// 🗑️ Supprimer un client
export const deleteClient = (id) => api.delete(`${BASE_URL}/${id}`);
