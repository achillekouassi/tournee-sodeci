
import { AdresseTechniqueDTO } from "../types/adresseTechniqueDTO";
import api from "./api";


const BASE_URL = "/adresses-techniques";

// 🟢 Créer une adresse technique
export const createAdresseTechnique = (data: AdresseTechniqueDTO) =>
  api.post(BASE_URL, data);

// 🟡 Modifier une adresse technique
export const updateAdresseTechnique = (id: number, data: AdresseTechniqueDTO) =>
  api.put(`${BASE_URL}/${id}`, data);

// 🟠 Récupérer toutes les adresses techniques
export const getAllAdressesTechniques = () => api.get<AdresseTechniqueDTO[]>(BASE_URL);

// 🟣 Récupérer une adresse technique par ID
export const getAdresseTechniqueById = (id: number) =>
  api.get<AdresseTechniqueDTO>(`${BASE_URL}/${id}`);

// 🧭 Récupérer les adresses actives
export const getActiveAdressesTechniques = () =>
  api.get<AdresseTechniqueDTO[]>(`${BASE_URL}/active`);

// 📄 Récupérer les adresses paginées
export const getPaginatedAdressesTechniques = (page = 0, size = 10) =>
  api.get<{ content: AdresseTechniqueDTO[]; totalElements: number }>(
    `${BASE_URL}/paginated?page=${page}&size=${size}`
  );

// 🔍 Récupérer par code AT
export const getAdresseByCodeAt = (codeAt: string) =>
  api.get<AdresseTechniqueDTO>(`${BASE_URL}/code-at/${codeAt}`);

// 👤 Récupérer les adresses d’un client
export const getAdressesByClient = (clientId: number) =>
  api.get<AdresseTechniqueDTO[]>(`${BASE_URL}/client/${clientId}`);

// 📑 Récupérer par référence contrat
export const getAdressesByReferenceContrat = (referenceContrat: string) =>
  api.get<AdresseTechniqueDTO[]>(`${BASE_URL}/reference-contrat/${referenceContrat}`);

// 🚗 Récupérer les adresses d’une tournée
export const getAdressesByCodeTournee = (codeTournee: string) =>
  api.get<AdresseTechniqueDTO[]>(`${BASE_URL}/tournee/${codeTournee}`);

// 🚚 Récupérer les adresses d’une tournée + groupe de facturation
export const getAdressesByTourneeAndGF = (codeTournee: string, gf: string) =>
  api.get<AdresseTechniqueDTO[]>(`${BASE_URL}/tournee/${codeTournee}/gf/${gf}`);

// 📍 Récupérer les adresses sans GPS
export const getAdressesWithoutGPS = () => api.get<AdresseTechniqueDTO[]>(`${BASE_URL}/without-gps`);

// 🚫 Récupérer les adresses sans tournée
export const getAdressesWithoutTournee = () => api.get<AdresseTechniqueDTO[]>(`${BASE_URL}/without-tournee`);

// 📍 Mettre à jour les coordonnées GPS
export const updateGPS = (id: number, latitude: number, longitude: number) =>
  api.put(`${BASE_URL}/${id}/gps?latitude=${latitude}&longitude=${longitude}`);

// 🗺️ Affecter une tournée
export const assignTournee = (id: number, codeTournee: string) =>
  api.put(`${BASE_URL}/${id}/tournee?codeTournee=${codeTournee}`);

// 🧾 Affecter une tournée en masse
export const assignTourneesBulk = (ids: number[], codeTournee: string) =>
  api.put(`${BASE_URL}/tournee/bulk?codeTournee=${codeTournee}`, ids);

// 🔒 Désactiver une adresse technique
export const deactivateAdresseTechnique = (id: number) =>
  api.patch(`${BASE_URL}/${id}/deactivate`);

// 🗑️ Supprimer une adresse technique
export const deleteAdresseTechnique = (id: number) => api.delete(`${BASE_URL}/${id}`);
