// src/components/tournees/AffectationCard.tsx
import React from 'react';
import { User, Calendar, Clock, Play, Pause, CheckCircle, LucideIcon } from 'lucide-react';
import { TourneeAffectationDTO, StatutAffectation } from '../../types/tourneeAffectation';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

type BadgeVariant = 'blue' | 'green' | 'yellow' | 'gray' | 'orange' | 'red' | 'purple';

interface AffectationCardProps {
  affectation: TourneeAffectationDTO;
  onAction: (id: number, action: string) => void;
}

export const AffectationCard: React.FC<AffectationCardProps> = ({ affectation, onAction }) => {
  const getStatutConfig = (statut?: StatutAffectation) => {
    const config: Record<
      string,
      { variant: BadgeVariant; label: string; icon: LucideIcon }
    > = {
      AFFECTEE: { variant: 'blue', label: 'Affectée', icon: Calendar },
      EN_COURS: { variant: 'green', label: 'En cours', icon: Play },
      EN_PAUSE: { variant: 'yellow', label: 'En pause', icon: Pause },
      TERMINEE: { variant: 'gray', label: 'Terminée', icon: CheckCircle },
      VALIDEE: { variant: 'green', label: 'Validée', icon: CheckCircle },
    };
    return config[statut || 'AFFECTEE'];
  };

  const conf = getStatutConfig(affectation.statut);
  const Icon = conf.icon;

  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-800">{affectation.tourneeCode}</h3>
            <Badge variant={conf.variant}>
              <Icon size={12} className="inline mr-1" />
              {conf.label}
            </Badge>
          </div>
          <p className="text-xs text-gray-600">{affectation.tourneeLibelle}</p>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center space-x-2">
          <User size={14} className="text-gray-400" />
          <span className="text-xs text-gray-600">{affectation.agentNom}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar size={14} className="text-gray-400" />
          <span className="text-xs text-gray-600">
            {new Date(affectation.dateAffectation).toLocaleDateString('fr-FR')}
          </span>
        </div>
        {affectation.dateDebutReelle && (
          <div className="flex items-center space-x-2">
            <Clock size={14} className="text-gray-400" />
            <span className="text-xs text-gray-600">
              Démarré: {new Date(affectation.dateDebutReelle).toLocaleString('fr-FR')}
            </span>
          </div>
        )}
      </div>

      {affectation.pourcentageCompletion !== undefined && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-600">Progression</span>
            <span className="font-medium text-gray-800">
              {affectation.nombreCompteursReleves}/{affectation.nombreCompteursTotal}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all"
              style={{ width: `${affectation.pourcentageCompletion}%` }}
            ></div>
          </div>
        </div>
      )}

      {affectation.nombreAnomalies! > 0 && (
        <div className="flex items-center justify-between text-xs mb-3 text-orange-600">
          <span>Anomalies</span>
          <span className="font-medium">{affectation.nombreAnomalies}</span>
        </div>
      )}

      <div className="flex space-x-2">
        {affectation.statut === StatutAffectation.AFFECTEE && (
          <Button
            size="sm"
            className="flex-1"
            onClick={() => affectation.id && onAction(affectation.id, 'start')}
          >
            <Play size={14} className="mr-1" />
            Démarrer
          </Button>
        )}
        {affectation.statut === StatutAffectation.EN_COURS && (
          <>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => affectation.id && onAction(affectation.id, 'pause')}
            >
              <Pause size={14} className="mr-1" />
              Pause
            </Button>
            <Button size="sm" onClick={() => affectation.id && onAction(affectation.id, 'finish')}>
              <CheckCircle size={14} className="mr-1" />
              Terminer
            </Button>
          </>
        )}
        {affectation.statut === StatutAffectation.EN_PAUSE && (
          <Button
            size="sm"
            className="flex-1"
            onClick={() => affectation.id && onAction(affectation.id, 'resume')}
          >
            <Play size={14} className="mr-1" />
            Reprendre
          </Button>
        )}
        {affectation.statut === StatutAffectation.TERMINEE && (
          <Button
            size="sm"
            className="flex-1"
            onClick={() => affectation.id && onAction(affectation.id, 'validate')}
          >
            <CheckCircle size={14} className="mr-1" />
            Valider
          </Button>
        )}
      </div>
    </Card>
  );
};
