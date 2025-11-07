// src/api/tourneeService.ts
import api from "./api";
import { TourneeDTO } from "../types/tournee";

export const tourneeService = {
  createTournee: (data: TourneeDTO) => api.post("/tournees", data),

  updateTournee: (id: number, data: TourneeDTO) =>
    api.put(`/tournees/${id}`, data),

  getTourneeById: (id: number) => api.get<TourneeDTO>(`/tournees/${id}`),

  getAllTournees: () => api.get<TourneeDTO[]>("/tournees"),

  getTourneesPaginated: (params: Record<string, any>) =>
    api.get<{ content: TourneeDTO[]; totalElements: number }>(
      "/tournees/paginated",
      { params }
    ),

  getActiveTournees: () => api.get<TourneeDTO[]>("/tournees/active"),

  getTourneeByCode: (codeTournee: string) =>
    api.get<TourneeDTO>(`/tournees/code/${codeTournee}`),

  getTourneesByAgence: (agenceId: number) =>
    api.get<TourneeDTO[]>(`/tournees/agence/${agenceId}`),

  getTourneesByStatut: (statut: string) =>
    api.get<TourneeDTO[]>(`/tournees/statut/${statut}`),

  updateStatutTournee: (id: number, statut: string) =>
    api.put(`/tournees/${id}/statut`, null, { params: { statut } }),

  deleteTournee: (id: number) => api.delete(`/tournees/${id}`),

  softDeleteTournee: (id: number) => api.patch(`/tournees/${id}/deactivate`),

  getTourneeStatistiques: (id: number) =>
    api.get(`/tournees/${id}/statistiques`),
};
