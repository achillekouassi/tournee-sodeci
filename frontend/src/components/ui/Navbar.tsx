import React from 'react';
import { Bell, LogOut, Menu, Search, X } from 'lucide-react';

interface NavbarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onLogout?: () => void;
  userName?: string;
  userRole?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  sidebarOpen,
  onToggleSidebar,
  onLogout,
  userName = 'John Doe',
  userRole = 'Opérateur'
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 w-56"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={18} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button
            onClick={onLogout}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut size={18} className="text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
};
