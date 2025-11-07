import React from 'react';
import { Home, MapPin, FileText, TrendingUp, Users, Settings } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface SidebarProps {
  isOpen: boolean;
  activeModule: string;
  onModuleChange: (moduleId: string) => void;
  userName?: string;
  userRole?: string;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Tableau de bord', icon: Home },
  { id: 'tournees', label: 'Tournées', icon: MapPin },
  { id: 'releves', label: 'Relevés', icon: FileText },
  { id: 'recouvrement', label: 'Recouvrement', icon: TrendingUp },
  { id: 'directions', label: 'Directions', icon: Users },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'statistiques', label: 'Statistiques', icon: TrendingUp },
  { id: 'parametres', label: 'Paramètres', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  activeModule,
  onModuleChange,
  userName = 'John Doe',
  userRole = 'Opérateur'
}) => {
  return (
    <aside className={`${isOpen ? 'w-56' : 'w-0'} bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex-shrink-0`}>
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white font-bold text-xs">
              S
            </div>
            <span className="font-semibold text-gray-800 text-xs">Logo</span>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onModuleChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 text-xs transition-colors ${
                  activeModule === item.id
                    ? 'bg-emerald-50 text-emerald-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-semibold text-xs">
              {userName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">{userName}</p>
              <p className="text-xs text-gray-500">{userRole}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
