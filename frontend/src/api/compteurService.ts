// src/services/compteurService.ts
import api from "./api";

// =====================
// CRUD de base
// =====================

// 🟢 Créer un compteur
export const createCompteur = (data: any) => api.post("/compteurs", data);

// 🟣 Codifier un compteur
export const codifierCompteur = (data: any) => api.post("/compteurs/codifier", data);

// 🟠 Mettre à jour un compteur
export const updateCompteur = (id: number, data: any) => api.put(`/compteurs/${id}`, data);

// 🔵 Obtenir tous les compteurs
export const getAllCompteurs = () => api.get("/compteurs");

// 🔵 Obtenir un compteur par ID
export const getCompteurById = (id: number) => api.get(`/compteurs/${id}`);

// 🔵 Obtenir les compteurs actifs
export const getActiveCompteurs = () => api.get("/compteurs/active");

// 🔵 Obtenir les compteurs paginés
export const getPaginatedCompteurs = (page: number, size: number) =>
  api.get(`/compteurs/paginated?page=${page}&size=${size}`);

// 🔴 Supprimer un compteur
export const deleteCompteur = (id: number) => api.delete(`/compteurs/${id}`);

// ⚫ Désactiver (soft delete)
export const deactivateCompteur = (id: number) => api.patch(`/compteurs/${id}/deactivate`);

// =====================
// Recherches et filtres
// =====================

export const getByNumeroCompteur = (numero: string) => api.get(`/compteurs/numero/${numero}`);
export const getByAdresseTechnique = (id: number) => api.get(`/compteurs/adresse-technique/${id}`);
export const getByCodeAt = (code: string) => api.get(`/compteurs/code-at/${code}`);
export const getByCodeTournee = (code: string) => api.get(`/compteurs/tournee/${code}`);
export const getByCodeAgence = (code: string) => api.get(`/compteurs/agence/${code}`);
export const getByGroupeFacturation = (gf: string) => api.get(`/compteurs/groupe-facturation/${gf}`);
export const getByTourneeAndGF = (codeTournee: string, gf: string) =>
  api.get(`/compteurs/tournee/${codeTournee}/gf/${gf}`);
export const getByReferenceContrat = (ref: string) => api.get(`/compteurs/reference-contrat/${ref}`);
export const getByStatut = (statut: string) => api.get(`/compteurs/statut/${statut}`);

export const searchCompteurs = (filters: any) => api.post(`/compteurs/search`, filters);

// =====================
// États et actions
// =====================

export const getCompteursAnomalie = () => api.get("/compteurs/anomalies");
export const getCompteursARemplacer = () => api.get("/compteurs/a-remplacer");
export const getCompteursWithoutGPS = () => api.get("/compteurs/without-gps");
export const getCompteursWithoutPhoto = () => api.get("/compteurs/without-photo");

export const getByDateDernierReleveBefore = (date: string) =>
  api.get(`/compteurs/dernier-releve-avant?date=${date}`);

export const updateIndex = (id: number, nouvelIndex: number) =>
  api.put(`/compteurs/${id}/index?nouvelIndex=${nouvelIndex}`);

export const updateStatut = (id: number, statut: string) =>
  api.put(`/compteurs/${id}/statut?statut=${statut}`);

export const markAsAnomalie = (id: number, enAnomalie: boolean) =>
  api.put(`/compteurs/${id}/anomalie?enAnomalie=${enAnomalie}`);

export const markAsARemplacer = (id: number, aRemplacer: boolean) =>
  api.put(`/compteurs/${id}/a-remplacer?aRemplacer=${aRemplacer}`);

export const updateGPS = (id: number, latitude: number, longitude: number) =>
  api.put(`/compteurs/${id}/gps?latitude=${latitude}&longitude=${longitude}`);

export const updatePhoto = (id: number, photoUrl: string) =>
  api.put(`/compteurs/${id}/photo?photoUrl=${photoUrl}`);

export const remplacerCompteur = (id: number, nouveau: any) =>
  api.post(`/compteurs/${id}/remplacer`, nouveau);

// =====================
// Statistiques
// =====================

export const countByTournee = (codeTournee: string) =>
  api.get(`/compteurs/statistics/count-by-tournee/${codeTournee}`);

export const countByAgence = (codeAgence: string) =>
  api.get(`/compteurs/statistics/count-by-agence/${codeAgence}`);

export const countAnomalies = () => api.get(`/compteurs/statistics/count-anomalies`);
export const countAnomaliesByTournee = (codeTournee: string) =>
  api.get(`/compteurs/statistics/count-anomalies-tournee/${codeTournee}`);

export const countARemplacer = () => api.get(`/compteurs/statistics/count-a-remplacer`);
export const countByStatut = (statut: string) =>
  api.get(`/compteurs/statistics/count-by-statut/${statut}`);
