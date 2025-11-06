import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '../ui/Input';

interface TourneeFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statutFilter: string;
  onStatutChange: (value: string) => void;
}

export const TourneeFilters: React.FC<TourneeFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statutFilter,
  onStatutChange
}) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Rechercher par code ou libellé..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={statutFilter}
            onChange={(e) => onStatutChange(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Tous les statuts</option>
            <option value="AFFECTEE">Affectée</option>
            <option value="EN_COURS">En cours</option>
            <option value="TERMINEE">Terminée</option>
            <option value="SUSPENDUE">Suspendue</option>
          </select>
        </div>
      </div>
    </div>
  );
};
