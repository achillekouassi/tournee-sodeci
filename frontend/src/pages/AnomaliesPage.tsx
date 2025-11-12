import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Anomalie {
  id: number;
  type: string;
  clientNom?: string;
  nomMatriAZ?: string;
  statut: string;
  description: string;
  resolution?: string;
  dateResolution?: string;
}

interface AnomaliesPageProps {
  data: Anomalie[];
  token: string;
  reload: () => void;
}

export function AnomaliesPage({ data }: AnomaliesPageProps) {
  const [filterType, setFilterType] = useState('');

  const filteredData = filterType
    ? data?.filter(a => a.type === filterType)
    : data;

  const types = [...new Set(data?.map(a => a.type) || [])];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">Gestion des anomalies</h1>
        <div className="flex items-center space-x-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-300 rounded-md"
          >
            <option value="">Tous les types</option>
            {types.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <div className="text-xs text-gray-500">{filteredData?.length || 0} anomalies</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredData?.map(anomalie => (
          <div key={anomalie.id} className="bg-white rounded-lg shadow p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">{anomalie.type}</h3>
                  <p className="text-xs text-gray-500">{anomalie.clientNom || anomalie.nomMatriAZ}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                anomalie.statut === 'EN_ATTENTE' ? 'bg-orange-100 text-orange-700' :
                anomalie.statut === 'RESOLUE' ? 'bg-green-100 text-green-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {anomalie.statut}
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-600">Description</p>
                <p className="text-xs text-gray-800">{anomalie.description}</p>
              </div>

              {anomalie.resolution && (
                <div>
                  <p className="text-xs text-gray-600">Résolution</p>
                  <p className="text-xs text-gray-800">{anomalie.resolution}</p>
                </div>
              )}

              {anomalie.dateResolution && (
                <p className="text-xs text-gray-500">
                  Résolu le {new Date(anomalie.dateResolution).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
