// src/components/tournees/TourneeCard.tsx

import React from 'react';
import { MapPin, Edit, Trash2, Eye } from 'lucide-react';
import { TourneeDTO, StatutTournee } from '../../types/tournee';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

type BadgeVariant = 'green' | 'blue' | 'gray' | 'orange' | 'red' | 'yellow' | 'purple';

interface TourneeCardProps {
  tournee: TourneeDTO;
  onViewDetails: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TourneeCard: React.FC<TourneeCardProps> = ({ 
  tournee, 
  onViewDetails, 
  onEdit, 
  onDelete 
}) => {
  const getStatutBadge = (statut?: StatutTournee) => {
    const config: Record<string, { variant: BadgeVariant; label: string }> = {
      ACTIVE: { variant: 'green', label: 'Active' },
      EN_COURS: { variant: 'blue', label: 'En cours' },
      TERMINEE: { variant: 'gray', label: 'Terminée' },
      SUSPENDUE: { variant: 'orange', label: 'Suspendue' },
      INACTIVE: { variant: 'red', label: 'Inactive' }
    };

    const conf = config[statut || 'ACTIVE'];
    return <Badge variant={conf.variant}>{conf.label}</Badge>;
  };

  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-800">{tournee.codeTournee}</h3>
            {getStatutBadge(tournee.statut)}
          </div>
          <p className="text-xs text-gray-600">{tournee.libelle}</p>
        </div>
        <MapPin size={16} className="text-emerald-600" />
      </div>

      <div className="space-y-2 mb-3">
        {tournee.quartier && (
          <div className="flex items-center space-x-2">
            <MapPin size={14} className="text-gray-400" />
            <span className="text-xs text-gray-600">{tournee.quartier}</span>
          </div>
        )}
        {tournee.nombreCompteursEstime && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Compteurs estimés</span>
            <span className="font-medium text-gray-800">{tournee.nombreCompteursEstime}</span>
          </div>
        )}
        {tournee.tauxCompletion !== undefined && (
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-600">Progression</span>
              <span className="font-medium text-gray-800">{tournee.tauxCompletion}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all"
                style={{ width: `${tournee.tauxCompletion}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <Button 
          size="sm" 
          variant="ghost" 
          className="flex-1" 
          onClick={() => tournee.id && onViewDetails(tournee.id)}
        >
          <Eye size={14} className="mr-1" />
          Détails
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={() => tournee.id && onEdit(tournee.id)}
        >
          <Edit size={14} />
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={() => tournee.id && onDelete(tournee.id)}
        >
          <Trash2 size={14} className="text-red-600" />
        </Button>
      </div>
    </Card>
  );
};
