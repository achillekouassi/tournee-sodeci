import React from 'react';
import { MapPin, User, Calendar, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface TourneeCardProps {
  tournee: {
    id: string;
    code: string;
    libelle: string;
    agent?: string;
    dateAffectation?: string;
    statut: 'AFFECTEE' | 'EN_COURS' | 'TERMINEE' | 'SUSPENDUE';
    progression: number;
    compteursTotal: number;
    compteursReleves: number;
    anomalies: number;
  };
  onViewDetails: (id: string) => void;
}

export const TourneeCard: React.FC<TourneeCardProps> = ({ tournee, onViewDetails }) => {
  const statutColors = {
    AFFECTEE: 'bg-blue-100 text-blue-700',
    EN_COURS: 'bg-emerald-100 text-emerald-700',
    TERMINEE: 'bg-gray-100 text-gray-700',
    SUSPENDUE: 'bg-orange-100 text-orange-700'
  };

  const statutLabels = {
    AFFECTEE: 'Affectée',
    EN_COURS: 'En cours',
    TERMINEE: 'Terminée',
    SUSPENDUE: 'Suspendue'
  };

  return (
    <Card padding="sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-800">{tournee.code}</h3>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${statutColors[tournee.statut]}`}>
              {statutLabels[tournee.statut]}
            </span>
          </div>
          <p className="text-xs text-gray-600">{tournee.libelle}</p>
        </div>
        <MapPin size={16} className="text-emerald-600" />
      </div>

      {tournee.agent && (
        <div className="flex items-center space-x-2 mb-2">
          <User size={14} className="text-gray-400" />
          <span className="text-xs text-gray-600">{tournee.agent}</span>
        </div>
      )}

      {tournee.dateAffectation && (
        <div className="flex items-center space-x-2 mb-3">
          <Calendar size={14} className="text-gray-400" />
          <span className="text-xs text-gray-600">{tournee.dateAffectation}</span>
        </div>
      )}

      <div className="mb-2">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-600">Progression</span>
          <span className="font-medium text-gray-800">
            {tournee.compteursReleves}/{tournee.compteursTotal}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-emerald-500 h-1.5 rounded-full transition-all"
            style={{ width: `${tournee.progression}%` }}
          ></div>
        </div>
      </div>

      {tournee.anomalies > 0 && (
        <div className="flex items-center justify-between text-xs mb-3">
          <span className="text-gray-600">Anomalies</span>
          <span className="font-medium text-orange-600">{tournee.anomalies}</span>
        </div>
      )}

      <Button
        size="sm"
        variant="ghost"
        className="w-full"
        onClick={() => onViewDetails(tournee.id)}
      >
        Voir détails
      </Button>
    </Card>
  );
};
