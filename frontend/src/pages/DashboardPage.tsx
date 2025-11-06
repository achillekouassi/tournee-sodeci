import React from 'react';
import { MapPin, FileText, TrendingUp, CheckCircle } from 'lucide-react';
import { KpiCard } from '../components/dashboard/KpiCard';

export const DashboardPage: React.FC = () => {
  const kpis = [
    {
      title: 'Tournées actives',
      value: 24,
      subtitle: '3 nouvelles affectations',
      icon: MapPin,
      iconColor: 'text-emerald-600',
      trend: { value: '+3 depuis hier', isPositive: true }
    },
    {
      title: 'Relevés du jour',
      value: '1,247',
      subtitle: 'Sur 1,500 prévus',
      icon: FileText,
      iconColor: 'text-blue-600',
      trend: { value: '83% complété', isPositive: true }
    },
    {
      title: 'Anomalies',
      value: 38,
      subtitle: '12 non traitées',
      icon: TrendingUp,
      iconColor: 'text-orange-600'
    },
    {
      title: 'Taux de réussite',
      value: '94.2%',
      subtitle: '+2.3% ce mois',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      trend: { value: '+2.3%', isPositive: true }
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-xs text-gray-500">
          Dernière mise à jour: {new Date().toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Activité récente</h3>
          <div className="space-y-3">
            {[
              { agent: 'Jean K.', action: 'A complété la tournée T-042', time: 'Il y a 15 min', color: 'bg-green-100 text-green-700' },
              { agent: 'Marie D.', action: 'Anomalie détectée sur C-12345', time: 'Il y a 32 min', color: 'bg-orange-100 text-orange-700' },
              { agent: 'Paul M.', action: 'Début de tournée T-038', time: 'Il y a 1h', color: 'bg-blue-100 text-blue-700' },
              { agent: 'Sophie B.', action: 'Recouvrement effectué (45,000 FCFA)', time: 'Il y a 2h', color: 'bg-emerald-100 text-emerald-700' }
            ].map((activity, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${activity.color}`}>
                  {activity.agent.split(' ')[0][0]}{activity.agent.split(' ')[1][0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800">{activity.agent}</p>
                  <p className="text-xs text-gray-600">{activity.action}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Performance par tournée</h3>
          <div className="space-y-3">
            {[
              { tournee: 'T-042', agent: 'Jean K.', completion: 100, count: '245/245' },
              { tournee: 'T-038', agent: 'Paul M.', completion: 67, count: '158/235' },
              { tournee: 'T-051', agent: 'Marie D.', completion: 45, count: '112/250' },
              { tournee: 'T-029', agent: 'Sophie B.', completion: 23, count: '52/225' }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-gray-700">{item.tournee}</span>
                    <span className="text-xs text-gray-500">• {item.agent}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-600">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      item.completion === 100 ? 'bg-green-500' :
                      item.completion >= 70 ? 'bg-emerald-500' :
                      item.completion >= 40 ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${item.completion}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
