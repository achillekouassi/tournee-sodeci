// src/components/direction/DirectionNavbar.tsx
import React from 'react';
import { Building, Users, UserCheck } from 'lucide-react';

interface DirectionNavbarProps {
  activeTab: 'directions-regionales' | 'agences' | 'agents';
  onTabChange: (tab: 'directions-regionales' | 'agences' | 'agents') => void;
}

export const DirectionNavbar: React.FC<DirectionNavbarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'directions-regionales' as const, label: 'Directions Régionales', icon: Building },
    { id: 'agences' as const, label: 'Agences', icon: Users },
    { id: 'agents' as const, label: 'Utilisateurs', icon: UserCheck }
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
                  ? 'border-blue-600 text-blue-600'
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