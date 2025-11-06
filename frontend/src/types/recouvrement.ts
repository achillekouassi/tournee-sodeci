import { StatutRecouvrement } from "./statutRecouvrement";
import { TypeActionRecouvrement } from "./typeActionRecouvrement";


export interface RecouvrementDTO {
  id?: number;
  clientId: number;
  referenceContrat: string;
  clientNom: string;
  clientTelephone?: string;
  adresseGeographique?: string;
  agentId: number;
  agentMatricule: string;
  agentNom?: string;
  affectationId?: number;
  codeTournee?: string;
  montantDu: number;
  montantEncaisse?: number;
  montantRestant?: number;
  dateAction: string; // ISO date
  periodeFacturation?: string; // ISO date
  statut?: StatutRecouvrement;
  typeAction?: TypeActionRecouvrement;
  latitude?: number;
  longitude?: number;
  precisionGps?: number;
  aMoratoire?: boolean;
  compteurDepose?: boolean;
  compteurFerme?: boolean;
  compteurRepose?: boolean;
  dateRepose?: string; // ISO date
  motifNonPaiement?: string;
  observations?: string;
  photoUrl?: string;
}
