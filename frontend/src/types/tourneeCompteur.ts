// src/types/tourneeCompteur.ts

export interface TourneeCompteurDTO {
  id?: number;
  tourneeId: number;
  tourneeCode?: string;
  compteurId: number;
  numeroCompteur: string;
  codeAt: string;
  affectationId?: number;
  ordrePassage?: number;
  estReleve?: boolean;
  dateReleve?: string;
  aAnomalie?: boolean;
  latitudeReleve?: number;
  longitudeReleve?: number;
  observations?: string;
  referenceContrat?: string;
  clientNom?: string;
  clientTelephone?: string;
  adresse?: string;
}

export interface AssignCompteursDTO {
  tourneeId: number;
  compteurIds: number[];
  reinitialiserOrdre?: boolean;
}