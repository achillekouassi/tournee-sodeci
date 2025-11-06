import { StatutMoratoire } from "./statutMoratoire";

export interface RecouvrementMoratoireDTO {
  id?: number;
  recouvrementId: number;
  montantTotal: number;
  pourcentageInitial?: number;
  montantInitialPaye?: number;
  montantRestant?: number;
  nombreEcheances: number;
  nombreEcheancesPayees?: number;
  dateDebut: string;
  dateFinPrevue: string;
  statut: StatutMoratoire;
  accordePar?: string;
  dateAccord?: string;
  observations?: string;
  referenceContrat?: string;
  clientNom?: string;
  tauxRealisation?: number;
}