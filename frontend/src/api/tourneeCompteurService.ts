import axios from "axios";
import { TourneeCompteurDTO } from "../types/tourneeCompteur";

const API_URL = "/api/tournees/compteurs";

// ==================== Tournées-Compteurs ====================
export const createTourneeCompteur = (data: TourneeCompteurDTO) =>
  axios.post(API_URL, data);

export const updateTourneeCompteur = (id: number, data: TourneeCompteurDTO) =>
  axios.put(`${API_URL}/${id}`, data);

export const getTourneeCompteurById = (id: number) =>
  axios.get<TourneeCompteurDTO>(`${API_URL}/${id}`);

export const getAllTourneeCompteurs = () =>
  axios.get<TourneeCompteurDTO[]>(API_URL);

export const getTourneeCompteursByTournee = (tourneeId: number) =>
  axios.get<TourneeCompteurDTO[]>(`${API_URL}/tournee/${tourneeId}`);

export const assignCompteursToTournee = (data: TourneeCompteurDTO[]) =>
  axios.post(`${API_URL}/assign`, data);

export const assignCompteurToTournee = (
  tourneeId: number,
  compteurId: number,
  ordrePassage?: number
) =>
  axios.post(
    `${API_URL}/tournee/${tourneeId}/compteur/${compteurId}`,
    null,
    { params: { ordrePassage } }
  );

export const removeCompteurFromTournee = (tourneeId: number, compteurId: number) =>
  axios.delete(`${API_URL}/tournee/${tourneeId}/compteur/${compteurId}`);

export const marquerCommeReleve = (
  id: number,
  latitude?: number,
  longitude?: number
) =>
  axios.put(`${API_URL}/${id}/marquer-releve`, null, { params: { latitude, longitude } });

export const marquerAnomalie = (id: number, aAnomalie: boolean) =>
  axios.put(`${API_URL}/${id}/anomalie`, null, { params: { aAnomalie } });

export const deleteTourneeCompteur = (id: number) =>
  axios.delete(`${API_URL}/${id}`);

export const softDeleteTourneeCompteur = (id: number) =>
  axios.patch(`${API_URL}/${id}/deactivate`);
