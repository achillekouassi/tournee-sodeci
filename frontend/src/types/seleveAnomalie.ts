import { StatutTraitementAnomalie } from "./statutTraitementAnomalie";

export interface ReleveAnomalieDTO {
  id?: number;
  releveId: number;
  typeAnomalieId: number;
  typeCode: string;
  typeLibelle: string;
  description?: string;
  statutTraitement?: StatutTraitementAnomalie;
  dateDetection: string;
  detecteePar?: string;
  dateTraitement?: string;
  traiteePar?: string;
  solutionApportee?: string;
  necessiteIntervention?: boolean;
  photoUrl?: string;
}
