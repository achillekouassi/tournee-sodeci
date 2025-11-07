// src/api/recouvrementEcheancierService.ts
import { PayerEcheanceDTO } from "../types/payerEcheance";
import { StatutEcheance } from "../types/statutEcheance";
import api from "./api";
import { RecouvrementEcheancierDTO } from "./recouvrementEcheancier";


const BASE_URL = "/recouvrements/echeanciers";

// ------------------------- CREATE -------------------------
export const createEcheance = (data: RecouvrementEcheancierDTO) =>
  api.post<RecouvrementEcheancierDTO>(BASE_URL, data);

export const payerEcheance = (data: PayerEcheanceDTO) =>
  api.post<RecouvrementEcheancierDTO>(`${BASE_URL}/payer`, data);

export const updateEcheance = (id: number, data: RecouvrementEcheancierDTO) =>
  api.put<RecouvrementEcheancierDTO>(`${BASE_URL}/${id}`, data);

// ------------------------- GET -------------------------
export const getEcheanceById = (id: number) =>
  api.get<RecouvrementEcheancierDTO>(`${BASE_URL}/${id}`);

export const getAllEcheances = () =>
  api.get<RecouvrementEcheancierDTO[]>(BASE_URL);

export const getAllPaginated = (page = 0, size = 10) =>
  api.get<{ content: RecouvrementEcheancierDTO[]; totalElements: number }>(
    `${BASE_URL}/paginated?page=${page}&size=${size}`
  );

export const getAllActive = () =>
  api.get<RecouvrementEcheancierDTO[]>(`${BASE_URL}/active`);

export const getByMoratoire = (moratoireId: number) =>
  api.get<RecouvrementEcheancierDTO[]>(`${BASE_URL}/moratoire/${moratoireId}`);

export const getByMoratoireOrderByNumero = (moratoireId: number) =>
  api.get<RecouvrementEcheancierDTO[]>(`${BASE_URL}/moratoire/${moratoireId}/ordered`);

export const getByStatut = (statut: StatutEcheance) =>
  api.get<RecouvrementEcheancierDTO[]>(`${BASE_URL}/statut/${statut}`);

export const getEcheancesEnRetard = () =>
  api.get<RecouvrementEcheancierDTO[]>(`${BASE_URL}/retard`);

export const getByDateEcheance = (date: string) =>
  api.get<RecouvrementEcheancierDTO[]>(`${BASE_URL}/date/${date}`);

export const getByDateEcheanceBetween = (debut: string, fin: string) =>
  api.get<RecouvrementEcheancierDTO[]>(`${BASE_URL}/date-range?debut=${debut}&fin=${fin}`);

export const getByAgent = (agentId: number) =>
  api.get<RecouvrementEcheancierDTO[]>(`${BASE_URL}/agent/${agentId}`);

// ------------------------- PATCH -------------------------
export const updateStatut = (id: number, statut: StatutEcheance) =>
  api.patch<void>(`${BASE_URL}/${id}/statut?statut=${statut}`);

export const verifierRetards = () =>
  api.post<void>(`${BASE_URL}/verifier-retards`);

// ------------------------- DELETE -------------------------
export const deleteEcheance = (id: number) =>
  api.delete<void>(`${BASE_URL}/${id}`);

export const softDeleteEcheance = (id: number) =>
  api.patch<void>(`${BASE_URL}/${id}/soft-delete`);

// ------------------------- STATS / SUMS -------------------------
export const countByMoratoire = (moratoireId: number) =>
  api.get<number>(`${BASE_URL}/moratoire/${moratoireId}/count`);

export const countEcheancesPayees = (moratoireId: number) =>
  api.get<number>(`${BASE_URL}/moratoire/${moratoireId}/count-payees`);

export const sumMontantPrevuByMoratoire = (moratoireId: number) =>
  api.get<number>(`${BASE_URL}/moratoire/${moratoireId}/sum-montant-prevu`);

export const sumMontantPayeByMoratoire = (moratoireId: number) =>
  api.get<number>(`${BASE_URL}/moratoire/${moratoireId}/sum-montant-paye`);
