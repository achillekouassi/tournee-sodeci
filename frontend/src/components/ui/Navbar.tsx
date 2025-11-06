import React, { useState, useRef, useEffect } from 'react';
import { Bell, Menu, Search, X } from 'lucide-react';

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
  userRole = 'Opérateur',
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left */}
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

        {/* Right */}
        <div className="flex items-center space-x-2 relative">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={18} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile circle */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-semibold text-xs hover:bg-emerald-200 transition-colors"
            >
              {userName.split(' ').map(n => n[0]).join('')}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-2">
                
                  <button
                    className="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-100"
                    onClick={() => alert('Profil clicked')}
                  >
                    Profil
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-100"
                    onClick={onLogout}
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
