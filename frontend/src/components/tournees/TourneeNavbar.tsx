// src/components/tournees/TourneeNavbar.tsx

import React from 'react';
import { MapPin, User, Navigation } from 'lucide-react';

interface TourneeNavbarProps {
  activeTab: 'tournees' | 'affectations' | 'compteurs';
  onTabChange: (tab: 'tournees' | 'affectations' | 'compteurs') => void;
}

export const TourneeNavbar: React.FC<TourneeNavbarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'tournees' as const, label: 'Tournées', icon: MapPin },
    { id: 'affectations' as const, label: 'Affectations', icon: User },
    { id: 'compteurs' as const, label: 'Compteurs', icon: Navigation }
  ];

  return (
    <div className="bg-white border-b border-gray-200 mb-6">
      <div className="flex space-x-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};