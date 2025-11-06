// src/pages/tournees/TourneesView.tsx

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { TourneeDTO, StatutTournee } from '../../types/tournee';
import { Button } from '../../components/ui/Button';
import { TourneeCard } from '../../components/tournees/TourneeCard';
import { TourneeForm } from '../../components/tournees/TourneeForm';
import { TourneeFilters } from '../../components/tournees/TourneeFilters';
import { Modal } from '../ui/Modal';

export const TourneesView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTournee, setEditingTournee] = useState<TourneeDTO | undefined>();

  // Données de démonstration
  const [tournees] = useState<TourneeDTO[]>([
    {
      id: 1,
      codeTournee: 'T-042',
      libelle: 'Cocody Angré - Zone résidentielle',
      codeAgence: 'AG001',
      statut: StatutTournee.TERMINEE,
      quartier: 'Angré',
      commune: 'Cocody',
      nombreCompteursEstime: 245,
      tauxCompletion: 100
    },
    {
      id: 2,
      codeTournee: 'T-038',
      libelle: 'Yopougon - Quartier Niangon',
      codeAgence: 'AG001',
      statut: StatutTournee.EN_COURS,
      quartier: 'Niangon',
      commune: 'Yopougon',
      nombreCompteursEstime: 235,
      tauxCompletion: 67
    },
    {
      id: 3,
      codeTournee: 'T-051',
      libelle: 'Abobo - Zone commerciale',
      codeAgence: 'AG001',
      statut: StatutTournee.EN_COURS,
      quartier: 'Abobo',
      nombreCompteursEstime: 250,
      tauxCompletion: 45
    }
  ]);

  const filteredTournees = tournees.filter(t => {
    const matchesSearch = t.codeTournee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.libelle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatut = !statutFilter || t.statut === statutFilter;
    return matchesSearch && matchesStatut;
  });

  const handleCreate = () => {
    setEditingTournee(undefined);
    setShowModal(true);
  };

  const handleEdit = (id: number) => {
    const tournee = tournees.find(t => t.id === id);
    setEditingTournee(tournee);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tournée ?')) {
      console.log('Deleting tournee:', id);
    }
  };

  const handleSubmit = (data: TourneeDTO) => {
    console.log('Submitting tournee:', data);
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Tournées</h2>
          <p className="text-xs text-gray-600 mt-1">
            {filteredTournees.length} tournée(s) trouvée(s)
          </p>
        </div>
        <Button size="sm" onClick={handleCreate}>
          <Plus size={16} className="mr-1" />
          Nouvelle tournée
        </Button>
      </div>

      <TourneeFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statutFilter={statutFilter}
        onStatutChange={setStatutFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTournees.map(tournee => (
          <TourneeCard
            key={tournee.id}
            tournee={tournee}
            onViewDetails={() => {}}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredTournees.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-600">Aucune tournée trouvée</p>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingTournee ? 'Modifier la tournée' : 'Nouvelle tournée'}
        size="lg"
      >
        <TourneeForm
          tournee={editingTournee}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};