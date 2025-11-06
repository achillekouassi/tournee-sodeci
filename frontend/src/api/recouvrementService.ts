import { EnregistrerActionDTO } from "../types/enregistrerAction";
import { RecouvrementDTO } from "../types/recouvrement";
import { StatutRecouvrement } from "../types/statutRecouvrement";
import api from "./api";


const BASE_URL = "/recouvrements";

// ------------------------- CREATE -------------------------

export const createRecouvrement = (data: RecouvrementDTO) =>
  api.post<RecouvrementDTO>(BASE_URL, data);

export const createRecouvrementByAgent = (agentMatricule: string, data: RecouvrementDTO) =>
  api.post<RecouvrementDTO>(`${BASE_URL}/agent/${agentMatricule}`, data);

export const enregistrerAction = (data: EnregistrerActionDTO) =>
  api.post<EnregistrerActionDTO>(`${BASE_URL}/action`, data);

// ------------------------- UPDATE -------------------------

export const updateRecouvrement = (id: number, data: RecouvrementDTO) =>
  api.put<RecouvrementDTO>(`${BASE_URL}/${id}`, data);

export const updateRecouvrementStatut = (id: number, statut: StatutRecouvrement) =>
  api.patch<RecouvrementDTO>(`${BASE_URL}/${id}/statut?statut=${statut}`);

// ------------------------- GET -------------------------

export const getRecouvrementById = (id: number) =>
  api.get<RecouvrementDTO>(`${BASE_URL}/${id}`);

export const getAllRecouvrements = () =>
  api.get<RecouvrementDTO[]>(BASE_URL);

export const getPaginatedRecouvrements = (page = 0, size = 10) =>
  api.get<{ content: RecouvrementDTO[]; totalElements: number }>(`${BASE_URL}/paginated?page=${page}&size=${size}`);

export const getActiveRecouvrements = () =>
  api.get<RecouvrementDTO[]>(`${BASE_URL}/active`);

export const getRecouvrementsByClient = (clientId: number) =>
  api.get<RecouvrementDTO[]>(`${BASE_URL}/client/${clientId}`);

export const getRecouvrementsByReferenceContrat = (referenceContrat: string) =>
  api.get<RecouvrementDTO[]>(`${BASE_URL}/contrat/${referenceContrat}`);

export const getRecouvrementsByAgent = (agentId: number) =>
  api.get<RecouvrementDTO[]>(`${BASE_URL}/agent/${agentId}`);

export const getRecouvrementsByAgentMatricule = (matricule: string) =>
  api.get<RecouvrementDTO[]>(`${BASE_URL}/agent/matricule/${matricule}`);

export const getRecouvrementsByAffectation = (affectationId: number) =>
  api.get<RecouvrementDTO[]>(`${BASE_URL}/affectation/${affectationId}`);

export const getRecouvrementsByTournee = (codeTournee: string) =>
  api.get<RecouvrementDTO[]>(`${BASE_URL}/tournee/${codeTournee}`);

export const getRecouvrementsByStatut = (statut: StatutRecouvrement) =>
  api.get<RecouvrementDTO[]>(`${BASE_URL}/statut/${statut}`);

export const getRecouvrementsAvecMoratoire = () =>
  api.get<RecouvrementDTO[]>(`${BASE_URL}/moratoire`);

export const getRecouvrementsByDateAction = (debut: string, fin: string) =>
  api.get<RecouvrementDTO[]>(`${BASE_URL}/date-action?debut=${debut}&fin=${fin}`);

export const getRecouvrementsByPeriode = (periode: string) =>
  api.get<RecouvrementDTO[]>(`${BASE_URL}/periode/${periode}`);

export const getRecouvrementsByAgentAndDate = (agentId: number, debut: string, fin: string) =>
  api.get<RecouvrementDTO[]>(`${BASE_URL}/agent/${agentId}/date?debut=${debut}&fin=${fin}`);

export const getRecouvrementsByCodeAgence = (codeAgence: string) =>
  api.get<RecouvrementDTO[]>(`${BASE_URL}/agence/${codeAgence}`);

export const getRecouvrementsByMontantRange = (min: number, max: number) =>
  api.get<RecouvrementDTO[]>(`${BASE_URL}/montant?min=${min}&max=${max}`);

export const getRecouvrementsWithMontantRestant = () =>
  api.get<RecouvrementDTO[]>(`${BASE_URL}/montant-restant`);

export const getRecouvrementsEnAttenteDepuis = (dateLimit: string) =>
  api.get<RecouvrementDTO[]>(`${BASE_URL}/en-attente?dateLimit=${dateLimit}`);

export const getCompteursDeposes = () =>
  api.get<RecouvrementDTO[]>(`${BASE_URL}/compteurs/deposes`);

export const getCompteursFermes = () =>
  api.get<RecouvrementDTO[]>(`${BASE_URL}/compteurs/fermes`);

export const getCompteursReposes = () =>
  api.get<RecouvrementDTO[]>(`${BASE_URL}/compteurs/reposes`);

// ------------------------- DELETE -------------------------

export const deleteRecouvrement = (id: number) =>
  api.delete<void>(`${BASE_URL}/${id}`);

export const softDeleteRecouvrement = (id: number) =>
  api.patch<void>(`${BASE_URL}/${id}/soft-delete`);

// ------------------------- STATS -------------------------

export const getRecouvrementStats = (dateDebut: string, dateFin: string) =>
  api.get<any>(`${BASE_URL}/statistiques?dateDebut=${dateDebut}&dateFin=${dateFin}`);

export const getRecouvrementStatsByAgent = (agentMatricule: string, dateDebut: string, dateFin: string) =>
  api.get<any>(`${BASE_URL}/statistiques/agent/${agentMatricule}?dateDebut=${dateDebut}&dateFin=${dateFin}`);

export const getRecouvrementStatsByTournee = (codeTournee: string, dateDebut: string, dateFin: string) =>
  api.get<any>(`${BASE_URL}/statistiques/tournee/${codeTournee}?dateDebut=${dateDebut}&dateFin=${dateFin}`);

export const getRecouvrementStatsByAgence = (codeAgence: string, dateDebut: string, dateFin: string) =>
  api.get<any>(`${BASE_URL}/statistiques/agence/${codeAgence}?dateDebut=${dateDebut}&dateFin=${dateFin}`);

export const countRecouvrementsByStatut = (statut: StatutRecouvrement) =>
  api.get<number>(`${BASE_URL}/count/statut/${statut}`);

export const countRecouvrementsByAgent = (agentId: number) =>
  api.get<number>(`${BASE_URL}/count/agent/${agentId}`);

export const sumMontantDu = () =>
  api.get<number>(`${BASE_URL}/sum/montant-du`);

export const sumMontantEncaisse = () =>
  api.get<number>(`${BASE_URL}/sum/montant-encaisse`);

export const getTauxRecouvrement = () =>
  api.get<number>(`${BASE_URL}/taux-recouvrement`);
