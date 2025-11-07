// src/services/tourneeCompteurService.ts
import axios from "axios";
import { TourneeCompteurDTO } from "../types/tourneeCompteur";

const API_URL = "/tournees/compteurs";

export const tourneeCompteurService = {
  createTourneeCompteur: (data: TourneeCompteurDTO) => axios.post(API_URL, data),
  updateTourneeCompteur: (id: number, data: TourneeCompteurDTO) => axios.put(`${API_URL}/${id}`, data),
  getTourneeCompteurById: (id: number) => axios.get<TourneeCompteurDTO>(`${API_URL}/${id}`),
  getAllTourneeCompteurs: () => axios.get<TourneeCompteurDTO[]>(API_URL),
  getTourneeCompteursByTournee: (tourneeId: number) => 
    axios.get<TourneeCompteurDTO[]>(`${API_URL}/tournee/${tourneeId}`),
  assignCompteursToTournee: (data: any[]) => axios.post(`${API_URL}/assign`, data),
  assignCompteurToTournee: (tourneeId: number, compteurId: number, ordrePassage?: number) =>
    axios.post(`${API_URL}/tournee/${tourneeId}/compteur/${compteurId}`, null, { params: { ordrePassage } }),
  removeCompteurFromTournee: (tourneeId: number, compteurId: number) =>
    axios.delete(`${API_URL}/tournee/${tourneeId}/compteur/${compteurId}`),
  marquerCommeReleve: (id: number, latitude?: number, longitude?: number) =>
    axios.put(`${API_URL}/${id}/marquer-releve`, null, { params: { latitude, longitude } }),
  marquerAnomalie: (id: number, aAnomalie: boolean) =>
    axios.put(`${API_URL}/${id}/anomalie`, null, { params: { aAnomalie } }),
  deleteTourneeCompteur: (id: number) => axios.delete(`${API_URL}/${id}`),
  softDeleteTourneeCompteur: (id: number) => axios.patch(`${API_URL}/${id}/deactivate`)
};