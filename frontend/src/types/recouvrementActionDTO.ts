// src/types/recouvrementActionDTO.ts
import { TypeActionRecouvrement } from "./typeActionRecouvrement";

export interface RecouvrementActionDTO {
  id?: number; // si tu hérites de BaseDTO
  recouvrementId: number;
  typeAction: TypeActionRecouvrement;
  dateAction: string; // ISO date string
  montantAction?: number;
  effectueePar?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  photoUrl?: string;
  numeroRecu?: string;
  modePaiement?: string;
  referenceContrat?: string;
  clientNom?: string;
  montantDu?: number;
}
