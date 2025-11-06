// src/api/recouvrementMoratoireService.ts
import { AccorderMoratoireDTO } from "../types/accorderMoratoire";
import { RecouvrementMoratoireDTO } from "../types/recouvrementMoratoire";
import { StatutMoratoire } from "../types/statutMoratoire";
import api from "./api";


const BASE_URL = "/recouvrements/moratoires";

// ------------------------- CREATE -------------------------
export const createMoratoire = (data: RecouvrementMoratoireDTO) =>
  api.post<RecouvrementMoratoireDTO>(BASE_URL, data);

export const accorderMoratoire = (data: AccorderMoratoireDTO) =>
  api.post<RecouvrementMoratoireDTO>(`${BASE_URL}/accorder`, data);

export const updateMoratoire = (id: number, data: RecouvrementMoratoireDTO) =>
  api.put<RecouvrementMoratoireDTO>(`${BASE_URL}/${id}`, data);

// ------------------------- GET -------------------------
export const getMoratoireById = (id: number) =>
  api.get<RecouvrementMoratoireDTO>(`${BASE_URL}/${id}`);

export const getAllMoratoires = () =>
  api.get<RecouvrementMoratoireDTO[]>(BASE_URL);

export const getAllPaginated = (page = 0, size = 10) =>
  api.get<{ content: RecouvrementMoratoireDTO[]; totalElements: number }>(
    `${BASE_URL}/paginated?page=${page}&size=${size}`
  );

export const getAllActive = () =>
  api.get<RecouvrementMoratoireDTO[]>(`${BASE_URL}/active`);

export const getByRecouvrement = (recouvrementId: number) =>
  api.get<RecouvrementMoratoireDTO>(`${BASE_URL}/recouvrement/${recouvrementId}`);

export const getByStatut = (statut: StatutMoratoire) =>
  api.get<RecouvrementMoratoireDTO[]>(`${BASE_URL}/statut/${statut}`);

export const getMoratoiresEchus = (date?: string) =>
  api.get<RecouvrementMoratoireDTO[]>(`${BASE_URL}/echus${date ? `?date=${date}` : ""}`);

export const getByDateFinPrevueBetween = (debut: string, fin: string) =>
  api.get<RecouvrementMoratoireDTO[]>(`${BASE_URL}/date-fin?debut=${debut}&fin=${fin}`);

export const getByAgent = (agentId: number) =>
  api.get<RecouvrementMoratoireDTO[]>(`${BASE_URL}/agent/${agentId}`);

export const getByCodeAgence = (codeAgence: string) =>
  api.get<RecouvrementMoratoireDTO[]>(`${BASE_URL}/agence/${codeAgence}`);

export const getWithMontantRestant = () =>
  api.get<RecouvrementMoratoireDTO[]>(`${BASE_URL}/montant-restant`);

// ------------------------- PATCH -------------------------
export const updateStatut = (id: number, statut: StatutMoratoire) =>
  api.patch<void>(`${BASE_URL}/${id}/statut?statut=${statut}`);

export const verifierEcheancesRetard = () =>
  api.post<void>(`${BASE_URL}/verifier-retards`);

// ------------------------- DELETE -------------------------
export const deleteMoratoire = (id: number) =>
  api.delete<void>(`${BASE_URL}/${id}`);

export const softDeleteMoratoire = (id: number) =>
  api.patch<void>(`${BASE_URL}/${id}/soft-delete`);

// ------------------------- STATS / SUMS -------------------------
export const countByStatut = (statut: StatutMoratoire) =>
  api.get<number>(`${BASE_URL}/count/statut/${statut}`);

export const sumMontantTotal = () =>
  api.get<number>(`${BASE_URL}/sum/montant-total`);

export const sumMontantRestant = () =>
  api.get<number>(`${BASE_URL}/sum/montant-restant`);
