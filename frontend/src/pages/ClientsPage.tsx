import { useState, useEffect } from 'react';
import { CheckCircle, Clock, Eye, X } from 'lucide-react';
import { api } from '../services/api';

interface Client {
  id: number;
  nomClient?: string;
  nomMatriAZ?: string;
  adresse: string;
  numeroCompteur: string;
  tourneeId: number;
  tourneCode: string;
  typeClient?: string;
  statutClient: string;
  releve?: boolean;
  ancienIndex?: number;
  description?: string;
  numeroFacture?: string;
  montantFacture?: number;
}

interface Tournee {
  id: number;
  code: string;
}

interface ClientsPageProps {
  data: Client[];
  token: string;
  reload: () => void;
}

export function ClientsPage({ data, token }: ClientsPageProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [filterTournee, setFilterTournee] = useState('');
  const [tournees, setTournees] = useState<Tournee[]>([]);

  useEffect(() => {
    loadTournees();
  }, []);

  const loadTournees = async () => {
    try {
      const t = await api.getTournees(token);
      setTournees(t);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredData = filterTournee
    ? data?.filter(c => c.tourneeId === parseInt(filterTournee))
    : data;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">Gestion des clients</h1>
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
          <div className="text-xs text-gray-500">{filteredData?.length || 0} clients</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Nom/Matricule</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Adresse</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">N° Compteur</th>
              <th className="px-3 py-2 text-center font-medium text-gray-700">Tournée</th>
              <th className="px-3 py-2 text-center font-medium text-gray-700">Type</th>
              <th className="px-3 py-2 text-center font-medium text-gray-700">Statut</th>
              <th className="px-3 py-2 text-center font-medium text-gray-700">Relevé</th>
              <th className="px-3 py-2 text-center font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.map(client => (
              <tr key={client.id} className="border-b hover:bg-gray-50">
                <td className="px-3 py-2">
                  <p className="font-medium text-gray-800">{client.nomClient || client.nomMatriAZ}</p>
                </td>
                <td className="px-3 py-2 text-gray-600">{client.adresse}</td>
                <td className="px-3 py-2 text-gray-600 font-mono">{client.numeroCompteur}</td>
                <td className="px-3 py-2 text-center text-gray-600">{client.tourneCode}</td>
                <td className="px-3 py-2 text-center">
                  <span className={`px-2 py-1 rounded text-xs ${
                    client.typeClient === 'PARTICULIER' ? 'bg-blue-100 text-blue-700' :
                    client.typeClient === 'ENTREPRISE' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {client.typeClient || 'N/A'}
                  </span>
                </td>
                <td className="px-3 py-2 text-center">
                  <span className={`px-2 py-1 rounded text-xs ${
                    client.statutClient === 'LISTE' ? 'bg-green-100 text-green-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {client.statutClient}
                  </span>
                </td>
                <td className="px-3 py-2 text-center">
                  {client.releve ? (
                    <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-400 mx-auto" />
                  )}
                </td>
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => setSelectedClient(client)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-800">Détails du client</h2>
              <button
                onClick={() => setSelectedClient(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-600">Nom/Matricule</p>
                  <p className="font-medium text-gray-800">{selectedClient.nomClient || selectedClient.nomMatriAZ}</p>
                </div>
                <div>
                  <p className="text-gray-600">N° Compteur</p>
                  <p className="font-medium text-gray-800 font-mono">{selectedClient.numeroCompteur}</p>
                </div>
                <div>
                  <p className="text-gray-600">Tournée</p>
                  <p className="font-medium text-gray-800">{selectedClient.tourneCode}</p>
                </div>
                <div>
                  <p className="text-gray-600">Type</p>
                  <p className="font-medium text-gray-800">{selectedClient.typeClient || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Statut</p>
                  <p className="font-medium text-gray-800">{selectedClient.statutClient}</p>
                </div>
                <div>
                  <p className="text-gray-600">Ancien Index</p>
                  <p className="font-medium text-gray-800">{selectedClient.ancienIndex || 0}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-600">Adresse</p>
                <p className="font-medium text-gray-800">{selectedClient.adresse}</p>
              </div>

              {selectedClient.description && (
                <div>
                  <p className="text-gray-600">Description</p>
                  <p className="font-medium text-gray-800">{selectedClient.description}</p>
                </div>
              )}

              {selectedClient.numeroFacture && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-gray-600">N° Facture</p>
                    <p className="font-medium text-gray-800">{selectedClient.numeroFacture}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Montant</p>
                    <p className="font-medium text-gray-800">{selectedClient.montantFacture} FCFA</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedClient(null)}
              className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition text-xs"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
