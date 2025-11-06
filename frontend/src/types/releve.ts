import { ReleveAnomalieDTO } from "./seleveAnomalie";
import { RelevePhotoDTO } from "./relevePhoto";
import { StatutReleve } from "./statutReleve";


export interface ReleveDTO {
  id?: number;
  compteurId: number;
  numeroCompteur: string;
  codeAt: string;
  referenceContrat?: string;
  agentId: number;
  agentMatricule: string;
  agentNom?: string;
  affectationId?: number;
  dateReleve: string; // ISO date string
  periodeReleve?: string;
  ancienIndex?: number;
  dateAncienIndex?: string;
  nouvelIndex: number;
  consommation?: number;
  latitude?: number;
  longitude?: number;
  precisionGps?: number;
  statut?: StatutReleve;
  aAnomalie?: boolean;
  nombreAnomalies?: number;
  estRegression?: boolean;
  estInchange?: boolean;
  estPassageZero?: boolean;
  estCodifie?: boolean;
  anomalies?: ReleveAnomalieDTO[];
  photos?: RelevePhotoDTO[];
  observations?: string;
  validePar?: string;
  dateValidation?: string;
}
