const API_URL = 'http://192.168.1.111:8080/api';

export const api = {
  login: async (matricule: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matricule, password }),
    });
    if (!res.ok) throw new Error('Authentification échouée');
    return res.json();
  },

  getDashboard: async (token: string) => {
    const res = await fetch(`${API_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Erreur chargement dashboard');
    return res.json();
  },

  getGF: async (token: string) => {
    const res = await fetch(`${API_URL}/groupes-facturation/summaries`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Erreur chargement GF');
    return res.json();
  },

  getActiveGFs: async (token: string) => {
    const res = await fetch(`${API_URL}/groupes-facturation/actifs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Erreur chargement GF actifs');
    return res.json();
  },

  // === GESTION DES STATUTS GF ===
  demarrerGF: async (token: string, gfId: number) => {
    const res = await fetch(`${API_URL}/groupes-facturation/${gfId}/demarrer`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Erreur démarrage GF');
    }
  },

  terminerGF: async (token: string, gfId: number) => {
    const res = await fetch(`${API_URL}/groupes-facturation/${gfId}/terminer`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Erreur fin GF');
    }
  },

  cloturerGF: async (token: string, gfId: number) => {
    const res = await fetch(`${API_URL}/groupes-facturation/${gfId}/cloturer`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Erreur clôture GF');
    }
  },

  rouvrirGF: async (token: string, gfId: number) => {
    const res = await fetch(`${API_URL}/groupes-facturation/${gfId}/rouvrir`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Erreur réouverture GF');
    }
  },

  getTournees: async (token: string) => {
    const res = await fetch(`${API_URL}/tournees`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Erreur chargement tournées');
    return res.json();
  },

  getUtilisateurs: async (token: string) => {
    const res = await fetch(`${API_URL}/utilisateurs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Erreur chargement utilisateurs');
    return res.json();
  },

  getAgentsActifs: async (token: string) => {
    const res = await fetch(`${API_URL}/utilisateurs/agents/actifs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Erreur chargement agents');
    return res.json();
  },

  getClients: async (token: string, tourneeId?: number) => {
    const url = tourneeId
      ? `${API_URL}/clients/tournee/${tourneeId}`
      : `${API_URL}/clients`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Erreur chargement clients');
    return res.json();
  },

  getReleves: async (token: string, tourneeId?: number) => {
    const url = tourneeId
      ? `${API_URL}/releves/tournee/${tourneeId}`
      : `${API_URL}/releves`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Erreur chargement relevés');
    return res.json();
  },

  getAnomalies: async (token: string, tourneeId?: number) => {
    const url = tourneeId
      ? `${API_URL}/anomalies/tournee/${tourneeId}`
      : `${API_URL}/anomalies`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Erreur chargement anomalies');
    return res.json();
  },

  createReleve: async (token: string, data: unknown, agentId: number) => {
    const res = await fetch(`${API_URL}/releves?agentId=${agentId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur création relevé');
    return res.json();
  },

  createUtilisateur: async (token: string, data: unknown) => {
    const res = await fetch(`${API_URL}/utilisateurs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur création utilisateur');
    return res.json();
  },

  affecterAgentMultiple: async (token: string, tourneeIds: number[], agentId: number) => {
    const payload = { tourneeIds, agentId };
    const res = await fetch(`${API_URL}/tournees/affecter`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Erreur affectation');
    }
    return res.ok ? { success: true } : res.json();
  },

  affecterAgent: async (token: string, tourneeId: number, agentId: number) => {
    return api.affecterAgentMultiple(token, [tourneeId], agentId);
  },

  importExcel: async (token: string, file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(`${API_URL}/import/excel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (!res.ok) throw new Error('Erreur importation');
    return res.json();
  },

  getTourneeDetail: async (token: string, tourneeId: number) => {
    const res = await fetch(`${API_URL}/tournees/${tourneeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Erreur chargement détail tournée');
    return res.json();
  },

  // Dans votre fichier api.ts, ajoutez ces méthodes :

getGFDetail: async (token: string, gfId: number) => {
  const res = await fetch(`${API_URL}/groupes-facturation/${gfId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Erreur chargement détail GF');
  return res.json();
},

getTourneesByGF: async (token: string, gfId: number) => {
  const res = await fetch(`${API_URL}/tournees/gf/${gfId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Erreur chargement tournées par GF');
  return res.json();
},
};