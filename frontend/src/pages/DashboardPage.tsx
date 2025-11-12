import { FileText, Clock, BarChart3, CheckCircle } from 'lucide-react';

interface DashboardData {
  totalGF: number;
  gfEnCours: number;
  totalTournees: number;
  clientsReleves: number;
  totalClients: number;
  groupesFacturation?: Array<{
    id: number;
    codeGF: string;
    description: string;
    nombreTournees: number;
    nombreClients: number;
    clientsReleves: number;
    statut: string;
    tauxAvancement: number;
  }>;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: 'blue' | 'orange' | 'purple' | 'green';
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-lg font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function GFRow({ gf }: { gf: DashboardData['groupesFacturation'][number] }) {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-800">{gf.codeGF} - {gf.description}</p>
        <p className="text-xs text-gray-500">{gf.nombreTournees} tournées • {gf.clientsReleves}/{gf.nombreClients} relevés</p>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 rounded text-xs ${
          gf.statut === 'EN_COURS' ? 'bg-orange-100 text-orange-700' :
          gf.statut === 'CLOTURE' ? 'bg-gray-100 text-gray-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {gf.statut}
        </span>
        <span className="text-xs font-medium text-gray-600">{gf.tauxAvancement?.toFixed(0)}%</span>
      </div>
    </div>
  );
}

export function DashboardPage({ data }: { data: DashboardData | null }) {
  if (!data) return <div className="text-xs text-gray-500">Chargement...</div>;

  const stats = [
    { label: 'Total GF', value: data.totalGF, icon: FileText, color: 'blue' as const },
    { label: 'GF En cours', value: data.gfEnCours, icon: Clock, color: 'orange' as const },
    { label: 'Tournées', value: data.totalTournees, icon: BarChart3, color: 'purple' as const },
    { label: 'Clients relevés', value: `${data.clientsReleves}/${data.totalClients}`, icon: CheckCircle, color: 'green' as const }
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-gray-800">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">Groupes de facturation</h2>
        <div className="space-y-2">
          {data.groupesFacturation?.slice(0, 5).map(gf => (
            <GFRow key={gf.id} gf={gf} />
          ))}
        </div>
      </div>
    </div>
  );
}
