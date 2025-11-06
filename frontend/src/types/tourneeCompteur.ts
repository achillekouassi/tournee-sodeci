export interface TourneeCompteurDTO {
  id?: number;
  tourneeId: number;
  compteurId: number;
  numeroCompteur: string;
  codeAt: string;
  affectationId?: number;
  ordrePassage?: number;
  estReleve?: boolean;
  dateReleve?: string; // ISO string
  aAnomalie?: boolean;
  latitudeReleve?: number;
  longitudeReleve?: number;
  observations?: string;
}
