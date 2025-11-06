// src/types/tournee.ts

export enum StatutTournee {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  EN_COURS = "EN_COURS",
  TERMINEE = "TERMINEE",
  SUSPENDUE = "SUSPENDUE",
  ARCHIVEE = "ARCHIVEE"
}

export enum GroupeFacturation {
  GF1 = "GF1",
  GF2 = "GF2",
  GF3 = "GF3"
}

export interface TourneeDTO {
  id?: number;
  codeTournee: string;
  libelle: string;
  codeAgence: string;
  agenceId?: number;
  agenceLibelle?: string;
  groupeFacturation?: GroupeFacturation;
  description?: string;
  zoneGeographique?: string;
  quartier?: string;
  commune?: string;
  nombreCompteursEstime?: number;
  dureeEstimeeHeures?: number;
  statut?: StatutTournee;
  ordrePriorite?: number;
  observations?: string;
  nombreAffectationsActives?: number;
  nombreCompteursRattaches?: number;
  nombreCompteursReleves?: number;
  tauxCompletion?: number;
}

export interface TourneeStatistiquesDTO {
  tourneeId: number;
  codeTournee: string;
  libelle: string;
  nombreCompteursTotal: number;
  nombreCompteursReleves: number;
  nombreCompteursNonReleves: number;
  nombreAnomalies?: number;
  nombreAnomaliesTraitees?: number;
  tauxCompletion: number;
  tauxAnomalies?: number;
  nombreAffectations: number;
  nombreAffectationsEnCours: number;
  nombreAffectationsTerminees?: number;
  dateDebutPeriode?: string;
  dateFinPeriode?: string;
}