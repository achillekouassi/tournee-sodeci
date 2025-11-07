// src/components/direction/DirectionsView.tsx
import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Building, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Modal';
import { directionRegionaleService } from '../../../api/directionRegionaleService';
import { DirectionRegionaleDTO } from '../../../types/directionRegionaleDRO';
import { DirectionRegionaleFilters } from './DirectionRegionaleFilters';
import { DirectionRegionaleForm } from './DirectionRegionaleForm';

export const DirectionRegionalesView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDirection, setEditingDirection] = useState<DirectionRegionaleDTO | undefined>();
  const [directions, setDirections] = useState<DirectionRegionaleDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDirections = async () => {
    try {
      setLoading(true);
      const response = await directionRegionaleService.getAllDirections();
      
      // Gestion de la réponse (array simple ou paginé)
      if (Array.isArray(response)) {
        setDirections(response);
      } else if (response && Array.isArray(response.content)) {
        setDirections(response.content);
      } else {
        setDirections([]);
      }
      
      setError(null);
    } catch (err: any) {
      console.error('Erreur de chargement des directions:', err);
      setError("Impossible de charger les directions régionales depuis l'API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirections();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDirections();
    setRefreshing(false);
  };

  const filteredDirections = directions.filter(d => 
    d.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.adresse?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingDirection(undefined);
    setShowModal(true);
  };

  const handleEdit = (id: number) => {
    const direction = directions.find(d => d.id === id);
    setEditingDirection(direction);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette direction régionale ?')) {
      try {
        await directionRegionaleService.deleteDirection(id);
        setDirections(prev => prev.filter(d => d.id !== id));
      } catch (err) {
        console.error('Erreur de suppression:', err);
        alert("Erreur lors de la suppression de la direction régionale.");
      }
    }
  };

  const handleSubmit = async (data: DirectionRegionaleDTO) => {
    try {
      if (editingDirection && editingDirection.id) {
        await directionRegionaleService.updateDirection(editingDirection.id, data);
      } else {
        await directionRegionaleService.createDirection(data);
      }
      await fetchDirections();
      setShowModal(false);
    } catch (err) {
      console.error('Erreur de sauvegarde:', err);
      alert("Erreur lors de l'enregistrement de la direction régionale.");
    }
  };

  const formatCreationDate = (dateString?: string) =>
    dateString ? new Date(dateString).toLocaleDateString('fr-FR') : 'N/A';

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement des directions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 border border-red-200 rounded-lg">
        <p>{error}</p>
        <Button onClick={fetchDirections} className="mt-3">Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Directions Régionales</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredDirections.length} direction(s) trouvée(s)
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
            Nouvelle direction
          </Button>
        </div>
      </div>

      <DirectionRegionaleFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Tableau des directions régionales */}
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
              {filteredDirections.map((direction) => (
                <tr key={direction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{direction.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{direction.libelle}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      {direction.adresse ? (
                        <div className="flex items-start space-x-1">
                          <span className="line-clamp-2">{direction.adresse}</span>
                        </div>
                      ) : (
                        '-'
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 space-y-1">
                      {direction.telephone && (
                        <div className="flex items-center space-x-1">
                          <span>{direction.telephone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatCreationDate(direction.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-blue-50"
                        onClick={() => direction.id && handleEdit(direction.id)}
                      >
                        <Edit size={14} className="text-blue-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-red-50"
                        onClick={() => direction.id && handleDelete(direction.id)}
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

        {filteredDirections.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune direction trouvée</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? "Aucune direction ne correspond à vos critères de recherche." 
                : "Commencez par créer votre première direction régionale."
              }
            </p>
            {!searchTerm && (
              <Button onClick={handleCreate}>
                <Plus size={16} className="mr-1" />
                Créer une direction
              </Button>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingDirection ? 'Modifier la direction' : 'Nouvelle direction régionale'}
        size="lg"
      >
        <DirectionRegionaleForm
          direction={editingDirection}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};