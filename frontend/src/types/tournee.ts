
import { GroupeFacturation } from "./groupeFacturation";
import { StatutTournee } from "./statutTournee";


export interface TourneeDTO {
  id?: number;
  codeTournee: string;
  libelle: string;
  codeAgence: string;
  agenceId?: number;
  groupeFacturation?: GroupeFacturation;
  description?: string;
  zoneGeographique?: string;
  quartier?: string;
  commune?: string;
  nombreCompteursEstime?: number;
  dureeEstimeeHeures?: number;
  statut?: StatutTournee;
  ordrePriorite?: number;
  observations?: string;
}
