// src/components/client/ClientsView.tsx
import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Users, Edit, Trash2 } from 'lucide-react';
import { ClientDTO } from '../../types/ClientDTO';
import { clientService } from '../../api/clientService';
import { Button } from '../ui/Button';
import { ClientFilters } from './ClientFilters';
import { Modal } from '../ui/Modal';
import { ClientForm } from './ClientForm';


export const ClientsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientDTO | undefined>();
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientService.getAllClients();
      
      if (Array.isArray(response)) {
        setClients(response);
      } else if (response && Array.isArray(response.content)) {
        setClients(response.content);
      } else {
        setClients([]);
      }
      
      setError(null);
    } catch (err: any) {
      console.error('Erreur de chargement des clients:', err);
      setError("Impossible de charger les clients depuis l'API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchClients();
    setRefreshing(false);
  };

  const filteredClients = clients.filter(c => 
    c.referenceContrat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.prenoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telephone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.codeAgence?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingClient(undefined);
    setShowModal(true);
  };

  const handleEdit = (id: number) => {
    const client = clients.find(c => c.id === id);
    setEditingClient(client);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        await clientService.deleteClient(id);
        setClients(prev => prev.filter(c => c.id !== id));
      } catch (err) {
        console.error('Erreur de suppression:', err);
        alert("Erreur lors de la suppression du client.");
      }
    }
  };

  const handleSubmit = async (data: ClientDTO) => {
    try {
      if (editingClient && editingClient.id) {
        await clientService.updateClient(editingClient.id, data);
      } else {
        await clientService.createClient(data);
      }
      await fetchClients();
      setShowModal(false);
    } catch (err) {
      console.error('Erreur de sauvegarde:', err);
      alert("Erreur lors de l'enregistrement du client.");
    }
  };

  const getGroupeFacturationLabel = (gf: string) => {
    switch (gf) {
      case 'GF0': return 'Mensuel';
      case 'GF1': return 'Trimestriel T1';
      case 'GF2': return 'Trimestriel T2';
      case 'GF3': return 'Trimestriel T3';
      default: return gf;
    }
  };

  const getGroupeFacturationColor = (gf: string) => {
    switch (gf) {
      case 'GF0': return 'bg-blue-100 text-blue-800';
      case 'GF1': return 'bg-green-100 text-green-800';
      case 'GF2': return 'bg-orange-100 text-orange-800';
      case 'GF3': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) =>
    dateString ? new Date(dateString).toLocaleDateString('fr-FR') : '-';

  const formatMontant = (montant?: number) =>
    montant ? `${montant.toLocaleString('fr-FR')} FCFA` : '0 FCFA';

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement des clients...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 border border-red-200 rounded-lg">
        <p>{error}</p>
        <Button onClick={fetchClients} className="mt-3">Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Clients</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredClients.length} client(s) trouvé(s)
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
            Nouveau client
          </Button>
        </div>
      </div>

      <ClientFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Tableau des clients */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Référence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Groupe Facturation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Solde
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière Facturation
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.referenceContrat}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {client.nom} {client.prenoms}
                    </div>
                    {client.adresseGeographique && (
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        {client.adresseGeographique}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 space-y-1">
                      {client.telephone && (
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-500">📞</span>
                          <span>{client.telephone}</span>
                        </div>
                      )}
                      {client.email && (
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-500">✉️</span>
                          <span className="truncate max-w-xs">{client.email}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGroupeFacturationColor(client.groupeFacturation)}`}>
                      {getGroupeFacturationLabel(client.groupeFacturation)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {client.codeAgence}
                      {client.agenceLibelle && (
                        <div className="text-xs text-gray-500">{client.agenceLibelle}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm space-y-1">
                      <div className="text-gray-900">
                        Solde: {formatMontant(client.soldeCompte)}
                      </div>
                      <div className={`text-xs ${(client.montantDu || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        Dû: {formatMontant(client.montantDu)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(client.derniereFacturation?.toString())}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-blue-50"
                        onClick={() => client.id && handleEdit(client.id)}
                      >
                        <Edit size={14} className="text-blue-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-red-50"
                        onClick={() => client.id && handleDelete(client.id)}
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

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun client trouvé</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? "Aucun client ne correspond à vos critères de recherche." 
                : "Commencez par créer votre premier client."
              }
            </p>
            {!searchTerm && (
              <Button onClick={handleCreate}>
                <Plus size={16} className="mr-1" />
                Créer un client
              </Button>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingClient ? "Modifier le client" : 'Nouveau client'}
        size="lg"
      >
        <ClientForm
          client={editingClient}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};