// src/components/client/ClientFilters.tsx
import React from 'react';
import { Search } from 'lucide-react';

interface ClientFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const ClientFilters: React.FC<ClientFiltersProps> = ({
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={16} 
          />
          <input
            type="text"
            placeholder="Rechercher par référence, nom, prénoms, téléphone, email ou code agence..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};