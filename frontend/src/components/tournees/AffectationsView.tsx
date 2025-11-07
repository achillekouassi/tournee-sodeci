// src/pages/tournees/AffectationsView.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, RefreshCw } from 'lucide-react';
import { TourneeAffectationDTO, StatutAffectation } from '../../types/tourneeAffectation';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { AffectationCard } from '../../components/tournees/AffectationCard';
import { tourneeAffectationService } from '../../api/tourneeAffectationService';

export const AffectationsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [affectations, setAffectations] = useState<TourneeAffectationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);


  interface PaginatedResponse<T> {
  content: T[];
  totalElements?: number;
  totalPages?: number;
}

const loadAffectations = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await tourneeAffectationService.getAllAffectations();

    // Ici, on dit explicitement à TypeScript que response.data peut être un tableau ou un objet paginé
    const data: TourneeAffectationDTO[] = Array.isArray(response.data)
      ? response.data
      : Array.isArray((response.data as PaginatedResponse<TourneeAffectationDTO>).content)
      ? (response.data as PaginatedResponse<TourneeAffectationDTO>).content
      : [];

    setAffectations(data);
  } catch (err) {
    console.error('Erreur lors du chargement des affectations:', err);
    setError('Impossible de charger les affectations. Vérifiez votre connexion.');
    setAffectations([]);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};


  useEffect(() => {
    loadAffectations();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAffectations();
  };

  const filteredAffectations = affectations.filter(a => {
    const matchesSearch = 
      a.tourneeCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.agentNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.tourneeLibelle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.agentMatricule.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatut = !statutFilter || a.statut === statutFilter;
    return matchesSearch && matchesStatut;
  });

  const handleAction = async (id: number, action: string) => {
    try {
      const affectation = affectations.find(a => a.id === id);
      if (!affectation) {
        throw new Error('Affectation non trouvée');
      }

      switch(action) {
        case 'start':
          await tourneeAffectationService.demarrerTournee({
            affectationId: id,
            dateDebutReelle: new Date().toISOString()
          });
          break;
        case 'pause':
          await tourneeAffectationService.mettreEnPause(id);
          break;
        case 'resume':
          await tourneeAffectationService.reprendreTournee(id);
          break;
        case 'finish':
          await tourneeAffectationService.terminerTournee({
            affectationId: id,
            dateFinReelle: new Date().toISOString(),
            observations: 'Terminé via l\'application'
          });
          break;
        case 'validate':
          await tourneeAffectationService.validerAffectation(id);
          break;
        default:
          console.warn('Action non reconnue:', action);
      }
      
      await loadAffectations();
    } catch (err) {
      console.error(`Erreur lors de l'action ${action}:`, err);
      alert(`Erreur lors de l'exécution de l'action: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  };

  const AffectationForm: React.FC<{
    onSubmit: (data: any) => void;
    onCancel: () => void;
  }> = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
      tourneeId: 0,
      agentId: 0,
      agentMatricule: '',
      agentNom: '',
      dateAffectation: new Date().toISOString().split('T')[0],
      dateDebutPrevue: '',
      dateFinPrevue: '',
      observations: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tournée *
          </label>
          <select
            required
            value={formData.tourneeId}
            onChange={e => setFormData({ ...formData, tourneeId: parseInt(e.target.value) })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Sélectionner une tournée</option>
            <option value="1">T-042 - Cocody Angré</option>
            <option value="2">T-038 - Yopougon Niangon</option>
            <option value="3">T-051 - Abobo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Agent *
          </label>
          <select
            required
            value={formData.agentId}
            onChange={e => {
              const agentId = parseInt(e.target.value);
              const agents: Record<number, { matricule: string; nom: string }> = {
                1: { matricule: 'A001', nom: 'Jean Konan' },
                2: { matricule: 'A002', nom: 'Paul Mensah' },
                3: { matricule: 'A003', nom: 'Marie Diabaté' },
                4: { matricule: 'A004', nom: 'Ibrahim Touré' },
                5: { matricule: 'A005', nom: 'Sophie Bamba' }
              };
              const agent = agents[agentId];
              setFormData({
                ...formData,
                agentId,
                agentMatricule: agent?.matricule || '',
                agentNom: agent?.nom || ''
              });
            }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Sélectionner un agent</option>
            <option value="1">Jean Konan (A001)</option>
            <option value="2">Paul Mensah (A002)</option>
            <option value="3">Marie Diabaté (A003)</option>
            <option value="4">Ibrahim Touré (A004)</option>
            <option value="5">Sophie Bamba (A005)</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date d'affectation *
            </label>
            <input
              type="date"
              required
              value={formData.dateAffectation}
              onChange={e => setFormData({ ...formData, dateAffectation: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Début prévu
            </label>
            <input
              type="date"
              value={formData.dateDebutPrevue}
              onChange={e => setFormData({ ...formData, dateDebutPrevue: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fin prévue
            </label>
            <input
              type="date"
              value={formData.dateFinPrevue}
              onChange={e => setFormData({ ...formData, dateFinPrevue: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observations
          </label>
          <textarea
            value={formData.observations}
            onChange={e => setFormData({ ...formData, observations: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            Créer l'affectation
          </Button>
        </div>
      </form>
    );
  };

  const handleCreateAffectation = async (data: any) => {
    try {
      await tourneeAffectationService.createAffectation({
        tourneeId: data.tourneeId,
        agentId: data.agentId,
        agentMatricule: data.agentMatricule,
        agentNom: data.agentNom,
        dateAffectation: data.dateAffectation,
        dateDebutPrevue: data.dateDebutPrevue,
        dateFinPrevue: data.dateFinPrevue,
        observations: data.observations,
        statut: StatutAffectation.AFFECTEE
      });
      setShowModal(false);
      await loadAffectations();
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      alert('Erreur lors de la création de l\'affectation');
    }
  };

  if (loading && !refreshing) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        <span className="ml-2 text-gray-600">Chargement des affectations...</span>
      </div>
    );
  }

  if (error && affectations.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700 mb-4">{error}</p>
        <Button onClick={loadAffectations}>
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Affectations des Tournées</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredAffectations.length} affectation(s) trouvée(s)
            {statutFilter && ` • Filtre: ${statutFilter}`}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="secondary" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={16} className={`mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} className="mr-1" />
            Nouvelle affectation
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={16} 
            />
            <input
              type="text"
              placeholder="Rechercher par tournée, agent ou matricule..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={statutFilter}
              onChange={e => setStatutFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Tous les statuts</option>
              <option value="AFFECTEE">Affectée</option>
              <option value="EN_COURS">En cours</option>
              <option value="EN_PAUSE">En pause</option>
              <option value="TERMINEE">Terminée</option>
              <option value="VALIDEE">Validée</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAffectations.map(affectation => (
          <AffectationCard
            key={affectation.id}
            affectation={affectation}
            onAction={handleAction}
          />
        ))}
      </div>

      {filteredAffectations.length === 0 && !loading && (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune affectation trouvée</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statutFilter
                ? "Aucune affectation ne correspond à vos critères de recherche." 
                : "Commencez par créer votre première affectation."
              }
            </p>
            {!searchTerm && !statutFilter && (
              <Button onClick={() => setShowModal(true)}>
                <Plus size={16} className="mr-1" />
                Créer une affectation
              </Button>
            )}
          </div>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Nouvelle affectation"
        size="lg"
      >
        <AffectationForm
          onSubmit={handleCreateAffectation}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};