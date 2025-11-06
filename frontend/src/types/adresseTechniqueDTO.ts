// types/adresseTechniqueDTO.ts

import { GroupeFacturation } from "./groupeFacturation";


export interface AdresseTechniqueDTO {
  codeAt: string;
  referenceContrat: string;
  clientId: number;
  clientNom?: string;
  clientTelephone?: string;
  adresse?: string;
  latitude?: number;
  longitude?: number;
  quartier?: string;
  commune?: string;
  ville?: string;
  codeTournee?: string;
  observations?: string;
  nombreCompteurs?: number;
  groupeFacturation?: GroupeFacturation;
}
