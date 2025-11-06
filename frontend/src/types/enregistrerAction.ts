// src/types/enregistrerActionDTO.ts
import { TypeActionRecouvrement } from "./typeActionRecouvrement";

export interface EnregistrerActionDTO {
  recouvrementId: number;
  typeAction: TypeActionRecouvrement;
  montantPaye?: number;
  numeroRecu?: string;
  modePaiement?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  photoUrl?: string;
  effectueePar?: string;
}
