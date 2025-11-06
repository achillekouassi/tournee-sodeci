import { TypePhoto } from "./typePhoto";


export interface RelevePhotoDTO {
  id?: number;
  releveId: number;
  urlPhoto: string;
  typePhoto?: TypePhoto;
  datePrise: string;
  latitude?: number;
  longitude?: number;
  tailleFichier?: number;
  format?: string;
  estPrincipale?: boolean;
  description?: string;
}
