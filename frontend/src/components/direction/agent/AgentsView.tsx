// src/components/agent/AgentsView.tsx
import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, User, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Modal';
import { AgentDTO } from '../../../types/agent';
import { AgentFilters } from './AgentFilters';
import { AgentForm } from './AgentForm';
import { agentService } from '../../../api/agentService';

export const AgentsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AgentDTO | undefined>();
  const [agents, setAgents] = useState<AgentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await agentService.getAllAgents();
      
      if (Array.isArray(response)) {
        setAgents(response);
      } else {
        const agentsData = response?.data || response;
        if (Array.isArray(agentsData)) {
          setAgents(agentsData);
        } else {
          setAgents([]);
        }
      }
      
      setError(null);
    } catch (err: any) {
      console.error('Erreur de chargement des agents:', err);
      setError("Impossible de charger les agents depuis l'API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAgents();
    setRefreshing(false);
  };

  const filteredAgents = agents.filter(a => 
    a.matricule?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.prenoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.fonction?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.agenceLibelle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingAgent(undefined);
    setShowModal(true);
  };

  const handleEdit = (matricule: string) => {
    const agent = agents.find(a => a.matricule === matricule);
    setEditingAgent(agent);
    setShowModal(true);
  };

  const handleDelete = async (matricule: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) {
      try {
        await agentService.deleteAgent(matricule);
        setAgents(prev => prev.filter(a => a.matricule !== matricule));
      } catch (err) {
        console.error('Erreur de suppression:', err);
        alert("Erreur lors de la suppression de l'agent.");
      }
    }
  };

  const handleSubmit = async (data: AgentDTO) => {
    try {
      if (editingAgent && editingAgent.matricule) {
        await agentService.updateAgent(editingAgent.matricule, data);
      } else {
        await agentService.createAgent(data);
      }
      await fetchAgents();
      setShowModal(false);
    } catch (err) {
      console.error('Erreur de sauvegarde:', err);
      alert("Erreur lors de l'enregistrement de l'agent.");
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrateur';
      case 'OPERATEUR_SUPERVISION': return 'Opérateur Supervision';
      case 'AGENT_TERRAIN': return 'Agent Terrain';
      case 'AGENT_ZONE': return 'Agent Zone';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'OPERATEUR_SUPERVISION': return 'bg-purple-100 text-purple-800';
      case 'AGENT_TERRAIN': return 'bg-green-100 text-green-800';
      case 'AGENT_ZONE': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement des agents...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 border border-red-200 rounded-lg">
        <p>{error}</p>
        <Button onClick={fetchAgents} className="mt-3">Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Utilisateurs</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredAgents.length} Utilisateur(s) trouvé(s)
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
            Nouvel agent
          </Button>
        </div>
      </div>

      <AgentFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Tableau des agents */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matricule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom & Prénoms
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fonction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAgents.map((agent) => (
                <tr key={agent.matricule} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{agent.matricule}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {agent.nom} {agent.prenoms}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(agent.role)}`}>
                      {getRoleLabel(agent.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.fonction || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.agenceLibelle || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 space-y-1">
                      {agent.telephone && (
                        <div className="flex items-center space-x-1">
                          <span>{agent.telephone}</span>
                        </div>
                      )}

                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {agent.isLocked ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Verrouillé
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Actif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-blue-50"
                        onClick={() => handleEdit(agent.matricule)}
                      >
                        <Edit size={14} className="text-blue-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-red-50"
                        onClick={() => handleDelete(agent.matricule)}
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

        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun agent trouvé</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? "Aucun agent ne correspond à vos critères de recherche." 
                : "Commencez par créer votre premier agent."
              }
            </p>
            {!searchTerm && (
              <Button onClick={handleCreate}>
                <Plus size={16} className="mr-1" />
                Créer un agent
              </Button>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingAgent ? "Modifier l'agent" : 'Nouvel agent'}
        size="lg"
      >
        <AgentForm
          agent={editingAgent}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};