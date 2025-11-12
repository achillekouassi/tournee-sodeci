import { Menu, User, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  toggleSidebar: () => void;
  user: {
    nom: string;
    role: string;
  };
  onLogout: () => void;
}

export function Header({ toggleSidebar, user, onLogout }: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Fermer le menu quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    onLogout();
    setShowProfileMenu(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between relative">
      <button 
        onClick={toggleSidebar} 
        className="p-1 hover:bg-gray-100 rounded transition-colors"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      <div className="flex items-center space-x-3" ref={profileRef}>
        {/* Section utilisateur avec menu déroulant */}
        <button
          onClick={handleProfileClick}
          className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">{user.nom[0]}</span>
          </div>
        </button>

        {/* Menu déroulant Profil */}
        {showProfileMenu && (
          <div className="absolute top-full right-3 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">

            {/* Option Profil */}
            <button
              onClick={() => setShowProfileMenu(false)}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Mon profil</span>
            </button>

            {/* Séparateur */}
            <div className="border-t border-gray-100 my-1"></div>

            {/* Option Déconnexion */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}