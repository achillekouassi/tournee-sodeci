// src/api/agentService.ts
import { AgentDTO, ChangePasswordDTO, RoleType } from "../types/agent";
import api from "./api";

const BASE_URL = "/agents";

// 🟢 Créer un agent
export const createAgent = (data: AgentDTO) => api.post<AgentDTO>(BASE_URL, data);

// 🟡 Modifier un agent - CORRECTION: utiliser matricule au lieu de id
export const updateAgent = (matricule: string, data: AgentDTO) =>
  api.put<AgentDTO>(`${BASE_URL}/${matricule}`, data);

// 🟠 Récupérer tous les agents
export const getAllAgents = () => api.get<AgentDTO[]>(BASE_URL);

// 🟣 Récupérer un agent par matricule - CORRECTION
export const getAgentByMatricule = (matricule: string) => api.get<AgentDTO>(`${BASE_URL}/${matricule}`);

// 🟤 Supprimer un agent - CORRECTION: utiliser matricule
export const deleteAgent = (matricule: string) => api.delete<void>(`${BASE_URL}/${matricule}`);

// 🔵 Désactiver un agent - CORRECTION
export const deactivateAgent = (matricule: string) => api.patch<void>(`${BASE_URL}/${matricule}/deactivate`);

// 🔒 Verrouiller / Déverrouiller - CORRECTION
export const lockAgent = (matricule: string) => api.patch<void>(`${BASE_URL}/${matricule}/lock`);
export const unlockAgent = (matricule: string) => api.patch<void>(`${BASE_URL}/${matricule}/unlock`);

// 🔑 Changer mot de passe - CORRECTION
export const changePassword = (matricule: string, data: ChangePasswordDTO) =>
  api.put<void>(`${BASE_URL}/${matricule}/change-password`, data);

// 🔑 Réinitialiser mot de passe - CORRECTION
export const resetPassword = (matricule: string, newPassword: string) =>
  api.put<void>(`${BASE_URL}/${matricule}/reset-password?newPassword=${newPassword}`);

// 🔍 Recherches spécifiques
export const getAgentsByAgence = (agenceId: number) => api.get<AgentDTO[]>(`${BASE_URL}/agence/${agenceId}`);
export const getAgentsByRole = (role: RoleType) => api.get<AgentDTO[]>(`${BASE_URL}/role/${role}`);
export const getAgentsByDirectionRegionale = (drId: number) =>
  api.get<AgentDTO[]>(`${BASE_URL}/direction-regionale/${drId}`);
export const getAgentsByDirectionRegionaleAndRole = (drId: number, role: RoleType) =>
  api.get<AgentDTO[]>(`${BASE_URL}/direction-regionale/${drId}/role/${role}`);

// Exportez toutes les fonctions sous un objet agentService
export const agentService = {
  createAgent,
  updateAgent,
  getAllAgents,
  getAgentByMatricule,
  deleteAgent,
  deactivateAgent,
  lockAgent,
  unlockAgent,
  changePassword,
  resetPassword,
  getAgentsByAgence,
  getAgentsByRole,
  getAgentsByDirectionRegionale,
  getAgentsByDirectionRegionaleAndRole
};