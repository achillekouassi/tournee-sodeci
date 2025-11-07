import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { TourneeDTO } from '../../types/tournee';
import { Button } from '../../components/ui/Button';
import { TourneeCard } from '../../components/tournees/TourneeCard';
import { TourneeForm } from '../../components/tournees/TourneeForm';
import { TourneeFilters } from '../../components/tournees/TourneeFilters';
import { Modal } from '../../components/ui/Modal';
import { tourneeService } from '../../api/tourneeService';
import { AxiosResponse } from 'axios';

export const TourneesView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTournee, setEditingTournee] = useState<TourneeDTO | undefined>();
  const [tournees, setTournees] = useState<TourneeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  /** ✅ Charger les tournées depuis l’API au montage */
  useEffect(() => {
    fetchTournees();
  }, []);

 const fetchTournees = async () => {
  try {
    setLoading(true);
    console.log('🔄 Chargement des tournées depuis l’API...');
    
    // ⚡ Forcer le typage AxiosResponse
    const response: AxiosResponse<TourneeDTO[] | { content: TourneeDTO[] }> =
      await tourneeService.getAllTournees();

    console.log('✅ Réponse brute de l’API:', response);
    console.log('📦 Contenu de response.data:', response?.data);

    // Type guard
    if (Array.isArray(response.data)) {
      setTournees(response.data);
    } else if (
      response.data &&
      typeof response.data === "object" &&
      "content" in response.data &&
      Array.isArray(response.data.content)
    ) {
      setTournees(response.data.content);
    } else {
      console.warn('⚠️ Données inattendues, on définit tournees à []', response.data);
      setTournees([]);
    }

    setError(null);
  } catch (err: any) {
    console.error('❌ Erreur de chargement des tournées:', err);
    setError("Impossible de charger les tournées depuis l'API.");
  } finally {
    setLoading(false);
  }
};

  /** ✅ Rafraîchir les données */
  const handleRefresh = async () => {
    console.log('🔁 Rafraîchissement des tournées...');
    setRefreshing(true);
    await fetchTournees();
    setRefreshing(false);
  };

  /** ✅ Filtrer les tournées (recherche + statut) */
  const filteredTournees = Array.isArray(tournees)
    ? tournees.filter(t => {
        const matchesSearch =
          t.codeTournee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.quartier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.commune?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatut = !statutFilter || t.statut === statutFilter;

        return matchesSearch && matchesStatut;
      })
    : [];

  console.log('🔍 Données filtrées:', filteredTournees);

  /** ✅ Ouvrir le formulaire de création */
  const handleCreate = () => {
    console.log('🆕 Ouverture du formulaire de création');
    setEditingTournee(undefined);
    setShowModal(true);
  };

  /** ✅ Ouvrir le formulaire d’édition */
  const handleEdit = (id: number) => {
    const tournee = tournees.find(t => t.id === id);
    console.log('✏️ Édition de la tournée:', tournee);
    setEditingTournee(tournee);
    setShowModal(true);
  };

  /** ✅ Supprimer une tournée via l’API */
  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tournée ?')) {
      try {
        console.log('🗑️ Suppression de la tournée:', id);
        await tourneeService.deleteTournee(id);
        setTournees(prev => prev.filter(t => t.id !== id));
      } catch (err) {
        console.error('❌ Erreur de suppression:', err);
        alert("Erreur lors de la suppression de la tournée.");
      }
    }
  };

  /** ✅ Créer ou mettre à jour une tournée via l’API */
  const handleSubmit = async (data: TourneeDTO) => {
    try {
      console.log('💾 Données soumises:', data);
      if (editingTournee && editingTournee.id) {
        console.log('🛠️ Mise à jour de la tournée:', editingTournee.id);
        await tourneeService.updateTournee(editingTournee.id, data);
      } else {
        console.log('🆕 Création d’une nouvelle tournée');
        await tourneeService.createTournee(data);
      }
      await fetchTournees();
      setShowModal(false);
    } catch (err) {
      console.error('❌ Erreur de sauvegarde:', err);
      alert("Erreur lors de l'enregistrement de la tournée.");
    }
  };

  /** ✅ État de chargement */
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        <span className="ml-2 text-gray-600">Chargement des tournées...</span>
      </div>
    );
  }

  /** ✅ Message d’erreur */
  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 border border-red-200 rounded-lg">
        <p>{error}</p>
        <Button onClick={fetchTournees} className="mt-3">Réessayer</Button>
      </div>
    );
  }

  /** ✅ Vue principale */
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gestion des Tournées</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredTournees.length} tournée(s) trouvée(s)
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
          <Button onClick={handleCreate}>
            <Plus size={16} className="mr-1" />
            Nouvelle tournée
          </Button>
        </div>
      </div>

      <TourneeFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statutFilter={statutFilter}
        onStatutChange={setStatutFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTournees.map(tournee => (
          <TourneeCard
            key={tournee.id}
            tournee={tournee}
            onViewDetails={() => console.log('👁️ Détails de la tournée:', tournee.id)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredTournees.length === 0 && (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune tournée trouvée</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statutFilter 
                ? "Aucune tournée ne correspond à vos critères de recherche." 
                : "Commencez par créer votre première tournée."
              }
            </p>
            {!searchTerm && !statutFilter && (
              <Button onClick={handleCreate}>
                <Plus size={16} className="mr-1" />
                Créer une tournée
              </Button>
            )}
          </div>
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
