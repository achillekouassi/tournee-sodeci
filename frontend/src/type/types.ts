// types/gf.ts
export type StatutGF = 'NON_DEMARRE' | 'EN_COURS' | 'TERMINE' | 'CLOTURE';

export interface GroupeFacturation {
  id: number;
  codeGF: string;
  description: string;
  typeFacturation: string;
  moisDepart: string;
  statut: StatutGF;
  dateImport: string;
  dateCloture?: string;
  annee: number;
  mois?: number;
  nomFichier: string;
  nombreTournees: number;
  nombreClients: number;
  clientsReleves: number;
  tauxAvancement: number;
}

export interface GFData {
  id: number;
  codeGF: string;
  description: string;
  nombreTournees: number;
  nombreClients: number;
  clientsReleves: number;
  statut: StatutGF;
  tauxAvancement: number;
  annee?: number;
  mois?: number;
}