// src/types/agenceDTO.ts
export interface AgenceDTO {
  id?: number;
  code: string;
  libelle: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  directionRegionaleId: number;
  directionRegionaleLibelle?: string;
  createdAt?: string;
  updatedAt?: string;
}