import { AgentDTO, ChangePasswordDTO, RoleType } from "../types/Agent";
import api from "./api";


const BASE_URL = "/agents";

// 🟢 Créer un agent
export const createAgent = (data: AgentDTO) => api.post<AgentDTO>(BASE_URL, data);

// 🟡 Modifier un agent
export const updateAgent = (id: number, data: AgentDTO) =>
  api.put<AgentDTO>(`${BASE_URL}/${id}`, data);

// 🟠 Récupérer tous les agents
export const getAllAgents = () => api.get<AgentDTO[]>(BASE_URL);

// 🟣 Récupérer un agent par ID
export const getAgentById = (id: number) => api.get<AgentDTO>(`${BASE_URL}/${id}`);

// 🟤 Supprimer un agent
export const deleteAgent = (id: number) => api.delete<void>(`${BASE_URL}/${id}`);

// 🔵 Désactiver un agent
export const deactivateAgent = (id: number) => api.patch<void>(`${BASE_URL}/${id}/deactivate`);

// 🔒 Verrouiller / Déverrouiller
export const lockAgent = (id: number) => api.patch<void>(`${BASE_URL}/${id}/lock`);
export const unlockAgent = (id: number) => api.patch<void>(`${BASE_URL}/${id}/unlock`);

// 🔑 Changer mot de passe
export const changePassword = (id: number, data: ChangePasswordDTO) =>
  api.put<void>(`${BASE_URL}/${id}/change-password`, data);

// 🔑 Réinitialiser mot de passe
export const resetPassword = (id: number, newPassword: string) =>
  api.put<void>(`${BASE_URL}/${id}/reset-password?newPassword=${newPassword}`);

// 🔍 Recherches spécifiques
export const getAgentsByAgence = (agenceId: number) => api.get<AgentDTO[]>(`${BASE_URL}/agence/${agenceId}`);
export const getAgentsByRole = (role: RoleType) => api.get<AgentDTO[]>(`${BASE_URL}/role/${role}`);
export const getAgentsByDirectionRegionale = (drId: number) =>
  api.get<AgentDTO[]>(`${BASE_URL}/direction-regionale/${drId}`);
export const getAgentsByDirectionRegionaleAndRole = (drId: number, role: RoleType) =>
  api.get<AgentDTO[]>(`${BASE_URL}/direction-regionale/${drId}/role/${role}`);
export const getAgentByMatricule = (matricule: string) => api.get<AgentDTO>(`${BASE_URL}/matricule/${matricule}`);
