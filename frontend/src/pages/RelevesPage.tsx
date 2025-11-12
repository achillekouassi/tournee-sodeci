import { useState, useEffect } from 'react';
import { Activity, X } from 'lucide-react';
import { api } from '../services/api';

interface Releve {
  id: number;
  clientNom?: string;
  nomClient?: string;
  tourneeCode: string;
  tourneeId: number;
  ancienIndex: number;
  nouvelIndex?: number;
  consommation?: number;
  dateReleve: string;
  agentNom: string;
  casReleve: string;
}

interface Tournee {
  id: number;
  code: string;
}

interface Client {
  id: number;
  nomClient?: string;
  nomMatriAZ?: string;
  numeroCompteur: string;
}

interface RelevesPageProps {
  data: Releve[];
  token: string;
  reload: () => void;
  auth: {
    userId: number;
  };
}

export function RelevesPage({ data, token, reload, auth }: RelevesPageProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [filterTournee, setFilterTournee] = useState('');
  const [tournees, setTournees] = useState<Tournee[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    clientId: '',
    tourneeId: '',
    nouvelIndex: '',
    casReleve: 'NORMALE',
    commentaire: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTournees();
  }, []);

  useEffect(() => {
    if (formData.tourneeId) {
      loadClients(parseInt(formData.tourneeId));
    }
  }, [formData.tourneeId]);

  const loadTournees = async () => {
    try {
      const t = await api.getTournees(token);
      setTournees(t);
    } catch (err) {
      console.error(err);
    }
  };

  const loadClients = async (tourneeId: number) => {
    try {
      const c = await api.getClients(token, tourneeId);
      setClients(c);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      await api.createReleve(token, formData, auth.userId);
      setShowCreate(false);
      setFormData({
        clientId: '',
        tourneeId: '',
        nouvelIndex: '',
        casReleve: 'NORMALE',
        commentaire: ''
      });
      reload();
    } catch {
      alert('Erreur lors de la création du relevé');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = filterTournee
    ? data?.filter(r => r.tourneeId === parseInt(filterTournee))
    : data;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">Gestion des relevés</h1>
        <div className="flex items-center space-x-2">
          <select
            value={filterTournee}
            onChange={(e) => setFilterTournee(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-300 rounded-md"
          >
            <option value="">Toutes les tournées</option>
            {tournees.map(t => (
              <option key={t.id} value={t.id}>{t.code}</option>
            ))}
          </select>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center space-x-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition text-xs"
          >
            <Activity className="w-4 h-4" />
            <span>Nouveau relevé</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Client</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Tournée</th>
              <th className="px-3 py-2 text-center font-medium text-gray-700">Ancien Index</th>
              <th className="px-3 py-2 text-center font-medium text-gray-700">Nouvel Index</th>
              <th className="px-3 py-2 text-center font-medium text-gray-700">Consommation</th>
              <th className="px-3 py-2 text-center font-medium text-gray-700">Date</th>
              <th className="px-3 py-2 text-center font-medium text-gray-700">Agent</th>
              <th className="px-3 py-2 text-center font-medium text-gray-700">Cas</th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.map(releve => (
              <tr key={releve.id} className="border-b hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-800">{releve.clientNom || releve.nomClient}</td>
                <td className="px-3 py-2 text-gray-600">{releve.tourneeCode}</td>
                <td className="px-3 py-2 text-center text-gray-600">{releve.ancienIndex}</td>
                <td className="px-3 py-2 text-center font-medium text-gray-800">{releve.nouvelIndex || '-'}</td>
                <td className="px-3 py-2 text-center font-semibold text-blue-600">{releve.consommation || '-'}</td>
                <td className="px-3 py-2 text-center text-gray-600">
                  {new Date(releve.dateReleve).toLocaleDateString()}
                </td>
                <td className="px-3 py-2 text-center text-gray-600">{releve.agentNom}</td>
                <td className="px-3 py-2 text-center">
                  <span className={`px-2 py-1 rounded text-xs ${
                    releve.casReleve === 'NORMALE' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {releve.casReleve}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-800">Nouveau relevé</h2>
              <button
                onClick={() => setShowCreate(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tournée</label>
                <select
                  value={formData.tourneeId}
                  onChange={(e) => setFormData({ ...formData, tourneeId: e.target.value, clientId: '' })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md"
                >
                  <option value="">-- Sélectionner --</option>
                  {tournees.map(t => (
                    <option key={t.id} value={t.id}>{t.code}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Client</label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md"
                  disabled={!formData.tourneeId}
                >
                  <option value="">-- Sélectionner --</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.nomClient || c.nomMatriAZ} - {c.numeroCompteur}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nouvel index</label>
                <input
                  type="number"
                  value={formData.nouvelIndex}
                  onChange={(e) => setFormData({ ...formData, nouvelIndex: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Cas de relevé</label>
                <select
                  value={formData.casReleve}
                  onChange={(e) => setFormData({ ...formData, casReleve: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md"
                >
                  <option value="NORMALE">Normale</option>
                  <option value="COMPTEUR_BLOQUE">Compteur bloqué</option>
                  <option value="ABSENCE">Absence</option>
                  <option value="REFUS_ACCES">Refus d'accès</option>
                  <option value="COMPTEUR_CASSE">Compteur cassé</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Commentaire</label>
                <textarea
                  value={formData.commentaire}
                  onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md"
                  rows={2}
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition text-xs"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreate}
                  disabled={loading || !formData.clientId || !formData.nouvelIndex}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition text-xs disabled:opacity-50"
                >
                  {loading ? 'Création...' : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
