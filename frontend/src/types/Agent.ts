// types/agent.ts

export interface AgentDTO {
  matricule: string;
  nom: string;
  prenoms: string;
  fonction?: string;
  password?: string;
  role: RoleType;
  telephone?: string;
  email?: string;
  agenceId: number;
  agenceLibelle?: string;
  directionRegionaleLibelle?: string;
  isLocked?: boolean;
  failedLoginAttempts?: number;
}

export interface ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
}

export enum RoleType {
  ADMIN = "ADMIN",
  OPERATEUR_SUPERVISION = "OPERATEUR_SUPERVISION",
  AGENT_TERRAIN = "AGENT_TERRAIN",
  AGENT_ZONE = "AGENT_ZONE",
  DIRECTION = "DIRECTION",
}
