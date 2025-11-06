export interface PayerEcheanceDTO {
  echeanceId: number;
  montantPaye: number;
  numeroRecu?: string;
  modePaiement?: string;
  payePar?: string;
  observations?: string;
}