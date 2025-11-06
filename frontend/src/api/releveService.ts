import axios, { AxiosResponse } from "axios";
import { ReleveDTO } from "../types/releve";
import { StatutReleve } from "../types/statutReleve";
import { TypeAnomalieDTO } from "../types/TypeAnomalie";
import { ReleveAnomalieDTO } from "../types/seleveAnomalie";
import { StatutTraitementAnomalie } from "../types/statutTraitementAnomalie";


const API_BASE = "/api";

// ------------------------ Relevés ------------------------
const RELEVE_BASE = `${API_BASE}/releves`;

export const createReleve = (data: ReleveDTO): Promise<AxiosResponse<ReleveDTO>> =>
  axios.post(RELEVE_BASE, data);

export const createReleveFromTerrain = (data: ReleveDTO): Promise<AxiosResponse<ReleveDTO>> =>
  axios.post(`${RELEVE_BASE}/terrain`, data);

export const updateReleve = (id: number, data: ReleveDTO): Promise<AxiosResponse<ReleveDTO>> =>
  axios.put(`${RELEVE_BASE}/${id}`, data);

export const getReleveById = (id: number): Promise<AxiosResponse<ReleveDTO>> =>
  axios.get(`${RELEVE_BASE}/${id}`);

export const getAllReleves = (): Promise<AxiosResponse<ReleveDTO[]>> =>
  axios.get(RELEVE_BASE);

export const getAllRelevesPaginated = (params: { page?: number; size?: number }): Promise<AxiosResponse<ReleveDTO[]>> =>
  axios.get(`${RELEVE_BASE}/paginated`, { params });

export const getAllActiveReleves = (): Promise<AxiosResponse<ReleveDTO[]>> =>
  axios.get(`${RELEVE_BASE}/active`);

export const getRelevesByCompteur = (compteurId: number): Promise<AxiosResponse<ReleveDTO[]>> =>
  axios.get(`${RELEVE_BASE}/compteur/${compteurId}`);

export const getRelevesByNumeroCompteur = (numero: string): Promise<AxiosResponse<ReleveDTO[]>> =>
  axios.get(`${RELEVE_BASE}/numero-compteur/${numero}`);

export const getRelevesByCodeAt = (codeAt: string): Promise<AxiosResponse<ReleveDTO[]>> =>
  axios.get(`${RELEVE_BASE}/code-at/${codeAt}`);

export const getRelevesByAgent = (agentId: number): Promise<AxiosResponse<ReleveDTO[]>> =>
  axios.get(`${RELEVE_BASE}/agent/${agentId}`);

export const getRelevesByAgentMatricule = (matricule: string): Promise<AxiosResponse<ReleveDTO[]>> =>
  axios.get(`${RELEVE_BASE}/agent/matricule/${matricule}`);

export const getRelevesByAffectation = (affectationId: number): Promise<AxiosResponse<ReleveDTO[]>> =>
  axios.get(`${RELEVE_BASE}/affectation/${affectationId}`);

export const getRelevesByStatut = (statut: StatutReleve): Promise<AxiosResponse<ReleveDTO[]>> =>
  axios.get(`${RELEVE_BASE}/statut/${statut}`);

export const getRelevesAvecAnomalie = (): Promise<AxiosResponse<ReleveDTO[]>> =>
  axios.get(`${RELEVE_BASE}/avec-anomalie`);

export const getRelevesAvecRegression = (): Promise<AxiosResponse<ReleveDTO[]>> =>
  axios.get(`${RELEVE_BASE}/regression`);

export const getRelevesInchanges = (): Promise<AxiosResponse<ReleveDTO[]>> =>
  axios.get(`${RELEVE_BASE}/inchanges`);

export const getRelevesPassageZero = (): Promise<AxiosResponse<ReleveDTO[]>> =>
  axios.get(`${RELEVE_BASE}/passage-zero`);

export const getRelevesCodifies = (): Promise<AxiosResponse<ReleveDTO[]>> =>
  axios.get(`${RELEVE_BASE}/codifies`);

export const getRelevesByCodeTournee = (codeTournee: string): Promise<AxiosResponse<ReleveDTO[]>> =>
  axios.get(`${RELEVE_BASE}/tournee/${codeTournee}`);

export const getRelevesByCodeAgence = (codeAgence: string): Promise<AxiosResponse<ReleveDTO[]>> =>
  axios.get(`${RELEVE_BASE}/agence/${codeAgence}`);

export const getRelevesByGroupeFacturation = (gf: string): Promise<AxiosResponse<ReleveDTO[]>> =>
  axios.get(`${RELEVE_BASE}/groupe-facturation/${gf}`);

export const getRelevesByPeriode = (periode: string): Promise<AxiosResponse<ReleveDTO[]>> =>
  axios.get(`${RELEVE_BASE}/periode`, { params: { periode } });

export const getHistoriqueCompteur = (compteurId: number): Promise<AxiosResponse<ReleveDTO[]>> =>
  axios.get(`${RELEVE_BASE}/compteur/${compteurId}/historique`);

export const getDernierReleve = (compteurId: number): Promise<AxiosResponse<ReleveDTO>> =>
  axios.get(`${RELEVE_BASE}/compteur/${compteurId}/dernier`);

export const getReleveSansGPS = (): Promise<AxiosResponse<ReleveDTO[]>> =>
  axios.get(`${RELEVE_BASE}/sans-gps`);

export const validerReleve = (data: ReleveDTO): Promise<AxiosResponse<ReleveDTO>> =>
  axios.post(`${RELEVE_BASE}/valider`, data);

export const updateReleveStatut = (id: number, statut: StatutReleve): Promise<AxiosResponse<ReleveDTO>> =>
  axios.put(`${RELEVE_BASE}/${id}/statut`, null, { params: { statut } });

export const getReleveStatistiques = (dateDebut: string, dateFin: string): Promise<AxiosResponse<any>> =>
  axios.get(`${RELEVE_BASE}/statistiques`, { params: { dateDebut, dateFin } });

export const deleteReleve = (id: number): Promise<AxiosResponse<void>> =>
  axios.delete(`${RELEVE_BASE}/${id}`);

export const softDeleteReleve = (id: number): Promise<AxiosResponse<void>> =>
  axios.patch(`${RELEVE_BASE}/${id}/deactivate`);

// ------------------------ Types d'Anomalies ------------------------
const TYPE_ANOMALIE_BASE = `${API_BASE}/types-anomalies`;

export const createTypeAnomalie = (data: TypeAnomalieDTO): Promise<AxiosResponse<TypeAnomalieDTO>> =>
  axios.post(TYPE_ANOMALIE_BASE, data);

export const updateTypeAnomalie = (id: number, data: TypeAnomalieDTO): Promise<AxiosResponse<TypeAnomalieDTO>> =>
  axios.put(`${TYPE_ANOMALIE_BASE}/${id}`, data);

export const getTypeAnomalieById = (id: number): Promise<AxiosResponse<TypeAnomalieDTO>> =>
  axios.get(`${TYPE_ANOMALIE_BASE}/${id}`);

export const getAllTypesAnomalies = (): Promise<AxiosResponse<TypeAnomalieDTO[]>> =>
  axios.get(TYPE_ANOMALIE_BASE);

export const getAllTypesAnomaliesPaginated = (params: { page?: number; size?: number }): Promise<AxiosResponse<TypeAnomalieDTO[]>> =>
  axios.get(`${TYPE_ANOMALIE_BASE}/paginated`, { params });

export const getAllActiveTypesAnomalies = (): Promise<AxiosResponse<TypeAnomalieDTO[]>> =>
  axios.get(`${TYPE_ANOMALIE_BASE}/active`);

export const getTypeAnomalieByCode = (code: string): Promise<AxiosResponse<TypeAnomalieDTO>> =>
  axios.get(`${TYPE_ANOMALIE_BASE}/code/${code}`);

// ------------------------ Anomalies de Relevés ------------------------
const ANOMALIE_BASE = `${API_BASE}/anomalies`;

export const createAnomalie = (data: ReleveAnomalieDTO): Promise<AxiosResponse<ReleveAnomalieDTO>> =>
  axios.post(ANOMALIE_BASE, data);

export const declarerAnomalie = (data: ReleveAnomalieDTO): Promise<AxiosResponse<ReleveAnomalieDTO>> =>
  axios.post(`${ANOMALIE_BASE}/declarer`, data);

export const traiterAnomalie = (data: ReleveAnomalieDTO): Promise<AxiosResponse<ReleveAnomalieDTO>> =>
  axios.post(`${ANOMALIE_BASE}/traiter`, data);

export const updateAnomalie = (id: number, data: ReleveAnomalieDTO): Promise<AxiosResponse<ReleveAnomalieDTO>> =>
  axios.put(`${ANOMALIE_BASE}/${id}`, data);

export const updateStatutTraitementAnomalie = (id: number, statut: StatutTraitementAnomalie): Promise<AxiosResponse<ReleveAnomalieDTO>> =>
  axios.put(`${ANOMALIE_BASE}/${id}/statut`, null, { params: { statut } });

export const deleteAnomalie = (id: number): Promise<AxiosResponse<void>> =>
  axios.delete(`${ANOMALIE_BASE}/${id}`);

export const softDeleteAnomalie = (id: number): Promise<AxiosResponse<void>> =>
  axios.patch(`${ANOMALIE_BASE}/${id}/desactiver`);
