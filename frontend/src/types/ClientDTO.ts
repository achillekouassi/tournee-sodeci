// src/types/clientDTO.ts
export interface ClientDTO {
  id?: number;
  referenceContrat: string;
  nom: string;
  prenoms?: string;
  telephone?: string;
  email?: string;
  adresseGeographique?: string;
  latitude?: number;
  longitude?: number;
  groupeFacturation: GroupeFacturation;
  codeAgence: string;
  agenceId: number;
  agenceLibelle?: string;
  soldeCompte?: number;
  montantDu?: number;
  derniereFacturation?: string;
  createdDate?: string;
  lastModifiedDate?: string;
}

export enum GroupeFacturation {
  GF0 = "GF0",
  GF1 = "GF1", 
  GF2 = "GF2",
  GF3 = "GF3"
}