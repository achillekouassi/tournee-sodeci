export interface AccorderMoratoireDTO {
  recouvrementId: number;
  pourcentageInitial: number;
  montantInitialPaye: number;
  nombreEcheances: number;
  dateDebut: string; // ISO date string
  observations?: string;
  accordePar?: string;
}