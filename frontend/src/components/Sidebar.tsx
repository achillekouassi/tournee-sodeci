import {
  Home,
  FileText,
  Users,
  BarChart3,
  LogOut,
  User,
  Activity,
  AlertTriangle,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  page: string;
  setPage: (page: string) => void;
  onLogout: () => void;
  user: {
    nom: string;
    role: string;
  };
}

export function Sidebar({ open, page, setPage, onLogout, user }: SidebarProps) {
  const items = [
    { id: 'dashboard', icon: Home, label: 'Tableau de bord' },
    { id: 'gf', icon: FileText, label: 'Groupes Facturation' },
    { id: 'tournees', icon: BarChart3, label: 'Tournées' },
    { id: 'anomalies', icon: AlertTriangle, label: 'Anomalies' },
    { id: 'users', icon: Users, label: 'Utilisateurs' },
  ];

  // Sidebar réduite (fermée)
  if (!open) {
    return (
      <div className="w-12 bg-gray-900 flex flex-col items-center py-4 space-y-4 shadow-md">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`p-2 rounded transition ${
              page === item.id ? 'bg-gray-800' : 'hover:bg-gray-700'
            }`}
            title={item.label}
          >
            <item.icon className="w-5 h-5 text-gray-100" />
          </button>
        ))}
        
        {/* Section utilisateur réduite */}
        <div className="mt-auto pt-4 border-t border-gray-700">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">{user.nom[0]}</span>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar ouverte (complète)
  return (
    <div className="w-48 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 flex flex-col shadow-lg">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <Home className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold">Gestion Relevés</span>
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded transition ${
              page === item.id ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-700">
        {/* Section utilisateur */}
        <div className="flex items-center space-x-3 px-2 py-2 mb-2 bg-gray-750 rounded">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">{user.nom[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{user.nom}</p>
            <p className="text-xs text-gray-400 truncate">{user.role}</p>
          </div>
        </div>

      </div>
    </div>
  );
}