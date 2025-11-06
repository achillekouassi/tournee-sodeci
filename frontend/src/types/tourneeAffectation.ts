// src/types/tourneeAffectation.ts

export enum StatutAffectation {
  AFFECTEE = "AFFECTEE",
  EN_COURS = "EN_COURS",
  EN_PAUSE = "EN_PAUSE",
  TERMINEE = "TERMINEE",
  ANNULEE = "ANNULEE",
  VALIDEE = "VALIDEE"
}

export interface TourneeAffectationDTO {
  id?: number;
  tourneeId: number;
  tourneeCode?: string;
  tourneeLibelle?: string;
  agentId: number;
  agentMatricule: string;
  agentNom: string;
  dateAffectation: string;
  dateDebutPrevue?: string;
  dateFinPrevue?: string;
  dateDebutReelle?: string;
  dateFinReelle?: string;
  statut?: StatutAffectation;
  nombreCompteursTotal?: number;
  nombreCompteursReleves?: number;
  nombreAnomalies?: number;
  pourcentageCompletion?: number;
  affectePar?: string;
  observations?: string;
  codeAgence?: string;
}

export interface CreateAffectationDTO {
  tourneeId: number;
  agentId: number;
  dateAffectation: string;
  dateDebutPrevue?: string;
  dateFinPrevue?: string;
  observations?: string;
}

export interface DemarrerTourneeDTO {
  affectationId: number;
  dateDebutReelle: string;
  latitude?: number;
  longitude?: number;
}

export interface TerminerTourneeDTO {
  affectationId: number;
  dateFinReelle: string;
  observations?: string;
  latitude?: number;
  longitude?: number;
}