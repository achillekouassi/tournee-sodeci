import { StatutEcheance } from "../types/statutEcheance";

export interface RecouvrementEcheancierDTO {
  id?: number;
  moratoireId: number;
  numeroEcheance: number;
  montantPrevu: number;
  montantPaye?: number;
  dateEcheance: string;
  datePaiement?: string;
  statut: StatutEcheance;
  estEnRetard?: boolean;
  nombreJoursRetard?: number;
  payePar?: string;
  numeroRecu?: string;
  modePaiement?: string;
  observations?: string;
  referenceContrat?: string;
  clientNom?: string;
}
