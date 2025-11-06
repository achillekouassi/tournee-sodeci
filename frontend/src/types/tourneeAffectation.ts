export enum StatutAffectation {
  AFFECTEE = "AFFECTEE",
  EN_COURS = "EN_COURS",
  EN_PAUSE = "EN_PAUSE",
  TERMINEE = "TERMINEE",
  ANNULEE = "ANNULEE",
  VALIDEE = "VALIDEE",
}

export interface TourneeAffectationDTO {
  id?: number;
  tourneeId: number;
  agentId: number;
  agentMatricule: string;
  agentNom: string;
  dateAffectation: string; // ISO string
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
}
