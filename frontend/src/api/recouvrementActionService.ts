// src/api/recouvrementActionService.ts
import api from "./api";

import { TypeActionRecouvrement } from "../types/typeActionRecouvrement";
import { RecouvrementActionDTO } from "../types/recouvrementActionDTO";

const BASE_URL = "/recouvrements/actions";

// ------------------------- CREATE -------------------------
export const createAction = (data: RecouvrementActionDTO) =>
  api.post<RecouvrementActionDTO>(BASE_URL, data);

export const updateAction = (id: number, data: RecouvrementActionDTO) =>
  api.put<RecouvrementActionDTO>(`${BASE_URL}/${id}`, data);

// ------------------------- GET -------------------------
export const getActionById = (id: number) =>
  api.get<RecouvrementActionDTO>(`${BASE_URL}/${id}`);

export const getAllActions = () =>
  api.get<RecouvrementActionDTO[]>(BASE_URL);

export const getAllActionsPaginated = (page = 0, size = 10) =>
  api.get<{ content: RecouvrementActionDTO[]; totalElements: number }>(
    `${BASE_URL}/paginated?page=${page}&size=${size}`
  );

export const getAllActiveActions = () =>
  api.get<RecouvrementActionDTO[]>(`${BASE_URL}/active`);

export const getActionsByRecouvrement = (recouvrementId: number) =>
  api.get<RecouvrementActionDTO[]>(`${BASE_URL}/recouvrement/${recouvrementId}`);

export const getActionsByType = (typeAction: TypeActionRecouvrement) =>
  api.get<RecouvrementActionDTO[]>(`${BASE_URL}/type/${typeAction}`);

export const getActionsByEffectueePar = (effectueePar: string) =>
  api.get<RecouvrementActionDTO[]>(`${BASE_URL}/effectuee-par/${effectueePar}`);

export const getActionsByDateBetween = (debut: string, fin: string) =>
  api.get<RecouvrementActionDTO[]>(`${BASE_URL}/date?debut=${debut}&fin=${fin}`);

export const getActionsByAgent = (agentId: number) =>
  api.get<RecouvrementActionDTO[]>(`${BASE_URL}/agent/${agentId}`);

export const getActionsByTournee = (codeTournee: string) =>
  api.get<RecouvrementActionDTO[]>(`${BASE_URL}/tournee/${codeTournee}`);

export const getActionsAvecMontant = () =>
  api.get<RecouvrementActionDTO[]>(`${BASE_URL}/avec-montant`);

// ------------------------- DELETE -------------------------
export const deleteAction = (id: number) =>
  api.delete<void>(`${BASE_URL}/${id}`);

export const softDeleteAction = (id: number) =>
  api.patch<void>(`${BASE_URL}/${id}/soft-delete`);

// ------------------------- STATS / SUMS -------------------------
export const countActionsByRecouvrement = (recouvrementId: number) =>
  api.get<number>(`${BASE_URL}/count/recouvrement/${recouvrementId}`);

export const sumMontantActions = () =>
  api.get<number>(`${BASE_URL}/sum/montant-total`);

export const sumMontantActionsByAgent = (matricule: string) =>
  api.get<number>(`${BASE_URL}/sum/montant-agent/${matricule}`);
