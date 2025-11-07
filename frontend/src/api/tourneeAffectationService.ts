// src/services/tourneeAffectationService.ts
import axios from "axios";
import { TourneeAffectationDTO } from "../types/tourneeAffectation";

const API_URL = "tournees/affectations";

export const tourneeAffectationService = {
  createAffectation: (data: TourneeAffectationDTO) => axios.post(API_URL, data),
  updateAffectation: (id: number, data: TourneeAffectationDTO) => axios.put(`${API_URL}/${id}`, data),
  getAffectationById: (id: number) => axios.get<TourneeAffectationDTO>(`${API_URL}/${id}`),
  getAllAffectations: () => axios.get<TourneeAffectationDTO[]>(API_URL),
  getAffectationsByTournee: (tourneeId: number) => 
    axios.get<TourneeAffectationDTO[]>(`${API_URL}/tournee/${tourneeId}`),
  getAffectationsByAgent: (agentId: number) => 
    axios.get<TourneeAffectationDTO[]>(`${API_URL}/agent/${agentId}`),
  demarrerTournee: (data: any) => axios.post(`${API_URL}/demarrer`, data),
  terminerTournee: (data: any) => axios.post(`${API_URL}/terminer`, data),
  mettreEnPause: (id: number) => axios.put(`${API_URL}/${id}/pause`),
  reprendreTournee: (id: number) => axios.put(`${API_URL}/${id}/reprendre`),
  annulerAffectation: (id: number, motif: string) =>
    axios.put(`${API_URL}/${id}/annuler`, null, { params: { motif } }),
  validerAffectation: (id: number) => axios.put(`${API_URL}/${id}/valider`),
  deleteAffectation: (id: number) => axios.delete(`${API_URL}/${id}`)
};