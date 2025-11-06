import api from "./api";

// 🔑 Types pour login
export interface LoginRequest {
  matricule: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  id: number;
  matricule: string;
  nom: string;
  prenoms: string;
  role: string; // ou RoleType si tu l'importes
  codeAgence: string;
  agenceLibelle?: string;
  directionRegionaleLibelle?: string;
}

// 🟢 Connexion
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", credentials);
  if (response.data?.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

// 🔴 Déconnexion
export const logout = async (): Promise<void> => {
  const token = localStorage.getItem("token");
  if (token) {
    await api.post(
      "/auth/logout",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    localStorage.removeItem("token");
  }
};
