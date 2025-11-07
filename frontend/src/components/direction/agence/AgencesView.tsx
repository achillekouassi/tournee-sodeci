// src/components/agence/AgencesView.tsx
import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Building, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Modal';
import { agenceService } from '../../../api/agenceService';
import { AgenceDTO } from '../../../types/agenceDTO';
import { AgenceFilters } from './AgenceFilters';
import { AgenceForm } from './AgenceForm';

export const AgencesView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAgence, setEditingAgence] = useState<AgenceDTO | undefined>();
  const [agences, setAgences] = useState<AgenceDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAgences = async () => {
    try {
      setLoading(true);
      const response = await agenceService.getAllAgences();
      
      // Gestion de la réponse (array simple ou paginé)
      if (Array.isArray(response)) {
        setAgences(response);
      } else if (response && Array.isArray(response.content)) {
        setAgences(response.content);
      } else {
        setAgences([]);
      }
      
      setError(null);
    } catch (err: any) {
      console.error('Erreur de chargement des agences:', err);
      setError("Impossible de charger les agences depuis l'API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgences();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAgences();
    setRefreshing(false);
  };

  const filteredAgences = agences.filter(a => 
    a.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.adresse?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.directionRegionaleLibelle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingAgence(undefined);
    setShowModal(true);
  };

  const handleEdit = (id: number) => {
    const agence = agences.find(a => a.id === id);
    setEditingAgence(agence);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette agence ?')) {
      try {
        await agenceService.deleteAgence(id);
        setAgences(prev => prev.filter(a => a.id !== id));
      } catch (err) {
        console.error('Erreur de suppression:', err);
        alert("Erreur lors de la suppression de l'agence.");
      }
    }
  };

  const handleSubmit = async (data: AgenceDTO) => {
    try {
      if (editingAgence && editingAgence.id) {
        await agenceService.updateAgence(editingAgence.id, data);
      } else {
        await agenceService.createAgence(data);
      }
      await fetchAgences();
      setShowModal(false);
    } catch (err) {
      console.error('Erreur de sauvegarde:', err);
      alert("Erreur lors de l'enregistrement de l'agence.");
    }
  };

  const formatCreationDate = (dateString?: string) =>
    dateString ? new Date(dateString).toLocaleDateString('fr-FR') : 'N/A';

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement des agences...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 border border-red-200 rounded-lg">
        <p>{error}</p>
        <Button onClick={fetchAgences} className="mt-3">Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Agences</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredAgences.length} agence(s) trouvée(s)
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
            Nouvelle agence
          </Button>
        </div>
      </div>

      <AgenceFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Tableau des agences */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Libellé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Direction Régionale
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Adresse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de création
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAgences.map((agence) => (
                <tr key={agence.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{agence.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{agence.libelle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {agence.directionRegionaleLibelle || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      {agence.adresse ? (
                        <div className="flex items-start space-x-1">
                          <span className="line-clamp-2">{agence.adresse}</span>
                        </div>
                      ) : (
                        '-'
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 space-y-1">
                      {agence.telephone && (
                        <div className="flex items-center space-x-1">

                          <span>{agence.telephone}</span>
                        </div>
                      )}

                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatCreationDate(agence.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-blue-50"
                        onClick={() => agence.id && handleEdit(agence.id)}
                      >
                        <Edit size={14} className="text-blue-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-red-50"
                        onClick={() => agence.id && handleDelete(agence.id)}
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAgences.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune agence trouvée</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? "Aucune agence ne correspond à vos critères de recherche." 
                : "Commencez par créer votre première agence."
              }
            </p>
            {!searchTerm && (
              <Button onClick={handleCreate}>
                <Plus size={16} className="mr-1" />
                Créer une agence
              </Button>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingAgence ? "Modifier l'agence" : 'Nouvelle agence'}
        size="lg"
      >
        <AgenceForm
          agence={editingAgence}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};