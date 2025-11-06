import axios from "axios";
import { TourneeDTO } from "../types/tournee";

const API_URL = "/api/tournees";

// ==================== Tournées ====================
export const createTournee = (data: TourneeDTO) => axios.post(API_URL, data);
export const updateTournee = (id: number, data: TourneeDTO) => axios.put(`${API_URL}/${id}`, data);
export const getTourneeById = (id: number) => axios.get<TourneeDTO>(`${API_URL}/${id}`);
export const getAllTournees = () => axios.get<TourneeDTO[]>(API_URL);
export const getTourneesPaginated = (params: Record<string, any>) => axios.get<{ content: TourneeDTO[]; totalElements: number }>(`${API_URL}/paginated`, { params });
export const getActiveTournees = () => axios.get<TourneeDTO[]>(`${API_URL}/active`);
export const getTourneeByCode = (codeTournee: string) => axios.get<TourneeDTO>(`${API_URL}/code/${codeTournee}`);
export const getTourneesByAgence = (agenceId: number) => axios.get<TourneeDTO[]>(`${API_URL}/agence/${agenceId}`);
export const getTourneesByStatut = (statut: string) => axios.get<TourneeDTO[]>(`${API_URL}/statut/${statut}`);
export const updateStatutTournee = (id: number, statut: string) => axios.put(`${API_URL}/${id}/statut`, null, { params: { statut } });
export const deleteTournee = (id: number) => axios.delete(`${API_URL}/${id}`);
export const softDeleteTournee = (id: number) => axios.patch(`${API_URL}/${id}/deactivate`);
export const getTourneeStatistiques = (id: number) => axios.get(`${API_URL}/${id}/statistiques`);
