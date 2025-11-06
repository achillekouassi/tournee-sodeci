// src/pages/tournees/AffectationsView.tsx

import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { TourneeAffectationDTO, StatutAffectation } from '../../types/tourneeAffectation';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { AffectationCard } from '../../components/tournees/AffectationCard';

export const AffectationsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Données de démonstration
  const [affectations] = useState<TourneeAffectationDTO[]>([
    {
      id: 1,
      tourneeId: 1,
      tourneeCode: 'T-042',
      tourneeLibelle: 'Cocody Angré - Zone résidentielle',
      agentId: 1,
      agentMatricule: 'A001',
      agentNom: 'Jean Konan',
      dateAffectation: '2025-01-06',
      statut: StatutAffectation.TERMINEE,
      nombreCompteursTotal: 245,
      nombreCompteursReleves: 245,
      nombreAnomalies: 3,
      pourcentageCompletion: 100
    },
    {
      id: 2,
      tourneeId: 2,
      tourneeCode: 'T-038',
      tourneeLibelle: 'Yopougon - Quartier Niangon',
      agentId: 2,
      agentMatricule: 'A002',
      agentNom: 'Paul Mensah',
      dateAffectation: '2025-01-06',
      dateDebutReelle: '2025-01-06T08:30:00',
      statut: StatutAffectation.EN_COURS,
      nombreCompteursTotal: 235,
      nombreCompteursReleves: 158,
      nombreAnomalies: 5,
      pourcentageCompletion: 67
    },
    {
      id: 3,
      tourneeId: 3,
      tourneeCode: 'T-051',
      tourneeLibelle: 'Abobo - Zone commerciale',
      agentId: 3,
      agentMatricule: 'A003',
      agentNom: 'Marie Diabaté',
      dateAffectation: '2025-01-06',
      statut: StatutAffectation.AFFECTEE,
      nombreCompteursTotal: 250,
      nombreCompteursReleves: 0,
      nombreAnomalies: 0,
      pourcentageCompletion: 0
    },
    {
      id: 4,
      tourneeId: 1,
      tourneeCode: 'T-029',
      tourneeLibelle: 'Plateau - Centre-ville',
      agentId: 4,
      agentMatricule: 'A004',
      agentNom: 'Ibrahim Touré',
      dateAffectation: '2025-01-05',
      dateDebutReelle: '2025-01-05T09:00:00',
      statut: StatutAffectation.EN_PAUSE,
      nombreCompteursTotal: 180,
      nombreCompteursReleves: 90,
      nombreAnomalies: 2,
      pourcentageCompletion: 50
    },
    {
      id: 5,
      tourneeId: 2,
      tourneeCode: 'T-067',
      tourneeLibelle: 'Marcory - Zone 4',
      agentId: 5,
      agentMatricule: 'A005',
      agentNom: 'Sophie Bamba',
      dateAffectation: '2025-01-05',
      dateDebutReelle: '2025-01-05T08:00:00',
      dateFinReelle: '2025-01-05T16:30:00',
      statut: StatutAffectation.VALIDEE,
      nombreCompteursTotal: 198,
      nombreCompteursReleves: 198,
      nombreAnomalies: 2,
      pourcentageCompletion: 100
    }
  ]);

  const filteredAffectations = affectations.filter(a => {
    const matchesSearch = 
      a.tourneeCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.agentNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.tourneeLibelle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatut = !statutFilter || a.statut === statutFilter;
    return matchesSearch && matchesStatut;
  });

  const handleAction = (id: number, action: string) => {
    console.log('Action:', action, 'on affectation:', id);
    // Ici, appeler les services API correspondants
    switch(action) {
      case 'start':
        // demarrerTournee(id)
        break;
      case 'pause':
        // mettreEnPause(id)
        break;
      case 'resume':
        // reprendreTournee(id)
        break;
      case 'finish':
        // terminerTournee(id)
        break;
      case 'validate':
        // validerAffectation(id)
        break;
    }
  };

  // Composant du formulaire d'affectation
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
            <option value="4">T-029 - Plateau</option>
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Affectations</h2>
          <p className="text-xs text-gray-600 mt-1">
            {filteredAffectations.length} affectation(s) trouvée(s)
          </p>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <Plus size={16} className="mr-1" />
          Nouvelle affectation
        </Button>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={16} 
            />
            <input
              type="text"
              placeholder="Rechercher par tournée ou agent..."
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

      {/* Liste des affectations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAffectations.map(affectation => (
          <AffectationCard
            key={affectation.id}
            affectation={affectation}
            onAction={handleAction}
          />
        ))}
      </div>

      {filteredAffectations.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-600">Aucune affectation trouvée</p>
        </div>
      )}

      {/* Modal de création */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Nouvelle affectation"
      >
        <AffectationForm
          onSubmit={(data) => {
            console.log('Creating affectation:', data);
            setShowModal(false);
          }}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};