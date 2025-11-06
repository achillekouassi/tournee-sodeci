import axios from "axios";
import { TourneeAffectationDTO } from "../types/tourneeAffectation";

const API_URL = "/api/tournees/affectations";

// ==================== Affectations ====================
export const createAffectation = (data: TourneeAffectationDTO) =>
  axios.post(API_URL, data);

export const updateAffectation = (id: number, data: TourneeAffectationDTO) =>
  axios.put(`${API_URL}/${id}`, data);

export const getAffectationById = (id: number) =>
  axios.get<TourneeAffectationDTO>(`${API_URL}/${id}`);

export const getAllAffectations = () =>
  axios.get<TourneeAffectationDTO[]>(API_URL);

export const getAffectationsByTournee = (tourneeId: number) =>
  axios.get<TourneeAffectationDTO[]>(`${API_URL}/tournee/${tourneeId}`);

export const getAffectationsByAgent = (agentId: number) =>
  axios.get<TourneeAffectationDTO[]>(`${API_URL}/agent/${agentId}`);

export const demarrerTournee = (data: TourneeAffectationDTO) =>
  axios.post(`${API_URL}/demarrer`, data);

export const terminerTournee = (data: TourneeAffectationDTO) =>
  axios.post(`${API_URL}/terminer`, data);

export const mettreEnPause = (id: number) =>
  axios.put(`${API_URL}/${id}/pause`);

export const reprendreTournee = (id: number) =>
  axios.put(`${API_URL}/${id}/reprendre`);

export const annulerAffectation = (id: number, motif: string) =>
  axios.put(`${API_URL}/${id}/annuler`, null, { params: { motif } });

export const validerAffectation = (id: number) =>
  axios.put(`${API_URL}/${id}/valider`);

export const deleteAffectation = (id: number) =>
  axios.delete(`${API_URL}/${id}`);
