import { useState, useEffect } from 'react';
import { MapPin, Calendar, User, Users, Percent, X, Eye, Edit, Trash2, ChevronLeft, ChevronRight, CheckSquare, Square, Search } from 'lucide-react';
import { api } from '../services/api';

interface Tournee {
  id: number;
  code: string;
  zone: string;
  statut: string;
  agentNom?: string;
  codeGF: string;
  clientsReleves: number;
  totalClients: number;
  tauxAvancement: number;
  dateDebut?: string;
}

interface Agent {
  id: number;
  nom: string;
  matricule: string;
}

interface TourneesPageProps {
  data: Tournee[];
  token: string;
  reload: () => void;
  onViewTournee?: (tourneeId: number) => void;
}

export function TourneesPage({ data, token, reload, onViewTournee }: TourneesPageProps) {
  const [showAffectation, setShowAffectation] = useState(false);
  const [selectedTournee, setSelectedTournee] = useState<Tournee | null>(null);
  const [selectedTournees, setSelectedTournees] = useState<number[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Debug logs
  useEffect(() => {
    console.log('📋 Tournées sélectionnées:', selectedTournees);
  }, [selectedTournees]);

  useEffect(() => {
    console.log('👤 Agent sélectionné:', selectedAgent);
  }, [selectedAgent]);

  useEffect(() => {
    loadAgents();
  }, []);

  // Filtrage des agents en fonction de la recherche
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAgents(agents);
    } else {
      const filtered = agents.filter(agent =>
        agent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.matricule.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAgents(filtered);
    }
  }, [searchTerm, agents]);

  const loadAgents = async () => {
    try {
      const a = await api.getAgentsActifs(token);
      setAgents(a);
      setFilteredAgents(a);
      console.log('👥 Agents chargés:', a.length);
    } catch (err) {
      console.error('Erreur chargement agents:', err);
    }
  };

  // Calculs pour la pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  // Gestion de la sélection multiple
  const toggleTourneeSelection = (tourneeId: number) => {
    setSelectedTournees(prev => 
      prev.includes(tourneeId) 
        ? prev.filter(id => id !== tourneeId)
        : [...prev, tourneeId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedTournees.length === currentData.length) {
      setSelectedTournees([]);
    } else {
      setSelectedTournees(currentData.map(tournee => tournee.id));
    }
  };

  const isTourneeSelected = (tourneeId: number) => {
    return selectedTournees.includes(tourneeId);
  };

  const isAllSelected = () => {
    return currentData.length > 0 && selectedTournees.length === currentData.length;
  };

  const isSomeSelected = () => {
    return selectedTournees.length > 0 && selectedTournees.length < currentData.length;
  };

  // Affectation multiple avec meilleure gestion d'erreur
  const handleAffectationMultiple = async () => {
    if (!selectedAgent || selectedTournees.length === 0) return;

    setLoading(true);
    try {
      console.log('🔧 Tentative d\'affectation multiple:', {
        tourneeIds: selectedTournees,
        agentId: selectedAgent.id,
        agent: selectedAgent
      });

      await api.affecterAgentMultiple(token, selectedTournees, selectedAgent.id);
      
      // Succès
      setShowAffectation(false);
      setSelectedTournees([]);
      setSelectedAgent(null);
      setSearchTerm('');
      reload();
      
      // Message de succès
      alert(`✅ ${selectedTournees.length} tournée(s) affectée(s) à ${selectedAgent.nom} avec succès !`);
      
    } catch (error) {
      console.error('❌ Erreur détaillée lors de l\'affectation multiple:', error);
      
      // Message d'erreur plus informatif
      if (error instanceof Error) {
        alert(`❌ Erreur lors de l'affectation: ${error.message}`);
      } else {
        alert('❌ Erreur inconnue lors de l\'affectation des tournées');
      }
    } finally {
      setLoading(false);
    }
  };

  // Affectation simple
  const handleAffectation = async () => {
    if (!selectedAgent || !selectedTournee) return;

    setLoading(true);
    try {
      console.log('🔧 Tentative d\'affectation simple:', {
        tourneeId: selectedTournee.id,
        agentId: selectedAgent.id,
        agent: selectedAgent
      });

      await api.affecterAgent(token, selectedTournee.id, selectedAgent.id);
      
      setShowAffectation(false);
      setSelectedTournee(null);
      setSelectedAgent(null);
      setSearchTerm('');
      reload();
      
      alert(`✅ Tournée ${selectedTournee.code} affectée à ${selectedAgent.nom} avec succès !`);
      
    } catch (error) {
      console.error('❌ Erreur détaillée lors de l\'affectation simple:', error);
      
      if (error instanceof Error) {
        alert(`❌ Erreur lors de l'affectation: ${error.message}`);
      } else {
        alert('❌ Erreur lors de l\'affectation');
      }
    } finally {
      setLoading(false);
    }
  };

  const openAffectationMultiple = () => {
    if (selectedTournees.length === 0) {
      alert('⚠️ Veuillez sélectionner au moins une tournée');
      return;
    }
    setShowAffectation(true);
  };

  const openAffectationSimple = (tournee: Tournee) => {
    setSelectedTournee(tournee);
    setSelectedTournees([tournee.id]);
    setShowAffectation(true);
  };

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    setSearchTerm(`${agent.nom} (${agent.matricule})`);
  };

  const clearSelection = () => {
    setSelectedAgent(null);
    setSearchTerm('');
  };

  // Gestion des actions
  const handleView = (tournee: Tournee) => {
    console.log('Tentative de navigation vers tournée:', tournee.id);
    if (onViewTournee) {
      onViewTournee(tournee.id);
    } else {
      console.log('Voir tournée:', tournee);
      alert(`Détails de la tournée: ${tournee.code}\nID: ${tournee.id}\nZone: ${tournee.zone}`);
    }
  };

  const handleEdit = (tournee: Tournee) => {
    console.log('Modifier tournée:', tournee);
  };

  const handleDelete = async (tournee: Tournee) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la tournée "${tournee.code}" ?`)) {
      try {
        console.log('Suppression tournée:', tournee.id);
        reload();
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'EN_COURS':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'TERMINEE':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'CLOTUREE':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'EN_COURS':
        return 'En cours';
      case 'TERMINEE':
        return 'Terminée';
      case 'CLOTUREE':
        return 'Clôturée';
      default:
        return 'Planifiée';
    }
  };

  // Gestion de la pagination
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">Gestion des tournées</h1>
        <div className="text-xs text-gray-500">
          {data.length} tournées • {selectedTournees.length} sélectionnée(s) • Page {currentPage} sur {totalPages}
        </div>
      </div>

      {/* Barre d'actions pour la sélection multiple */}
      {selectedTournees.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-blue-800">
                {selectedTournees.length} tournée(s) sélectionnée(s)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={openAffectationMultiple}
                className="bg-blue-600 text-white px-4 py-2 rounded text-xs hover:bg-blue-700 transition-colors"
              >
                Affecter les {selectedTournees.length} tournées
              </button>
              <button
                onClick={() => setSelectedTournees([])}
                className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-xs hover:bg-gray-200 transition-colors"
              >
                Tout désélectionner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contrôles de pagination en haut */}
      <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <label className="text-xs text-gray-700">
            Afficher :
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="ml-2 border border-gray-300 rounded px-2 py-1 text-xs"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="p-1.5 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-xs text-gray-600">
            {startIndex + 1}-{Math.min(endIndex, data.length)} sur {data.length}
          </span>
          
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="p-1.5 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tableau des tournées */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700 w-10">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center justify-center w-5 h-5 border border-gray-300 rounded hover:bg-gray-100"
                >
                  {isAllSelected() ? (
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                  ) : isSomeSelected() ? (
                    <div className="w-3 h-3 bg-blue-600 rounded-sm" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Tournée</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Zone</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">GF</th>
              <th className="px-4 py-3 text-center font-medium text-gray-700">Statut</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Agent</th>
              <th className="px-4 py-3 text-center font-medium text-gray-700">Clients</th>
              <th className="px-4 py-3 text-center font-medium text-gray-700">Avancement</th>
              <th className="px-4 py-3 text-center font-medium text-gray-700">Date début</th>
              <th className="px-4 py-3 text-center font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentData.map(tournee => (
              <tr key={tournee.id} className="hover:bg-gray-50">
                {/* Case à cocher */}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleTourneeSelection(tournee.id)}
                    className="flex items-center justify-center w-5 h-5 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    {isTourneeSelected(tournee.id) ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </td>

                {/* Code tournée */}
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-800">{tournee.code}</span>
                  </div>
                </td>

                {/* Zone */}
                <td className="px-4 py-3 text-gray-600">
                  {tournee.zone}
                </td>

                {/* GF */}
                <td className="px-4 py-3">
                  <span className="font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded">
                    {tournee.codeGF}
                  </span>
                </td>

                {/* Statut */}
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(tournee.statut)}`}>
                    {getStatusText(tournee.statut)}
                  </span>
                </td>

                {/* Agent */}
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className={`${!tournee.agentNom ? 'text-gray-400 italic' : 'text-gray-800'}`}>
                      {tournee.agentNom || 'Non affecté'}
                    </span>
                  </div>
                </td>

                {/* Clients */}
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-800">
                      {tournee.clientsReleves}/{tournee.totalClients}
                    </span>
                  </div>
                </td>

                {/* Avancement */}
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Percent className="w-4 h-4 text-gray-400" />
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">{tournee.tauxAvancement?.toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            tournee.tauxAvancement >= 80 ? 'bg-green-500' :
                            tournee.tauxAvancement >= 50 ? 'bg-orange-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${tournee.tauxAvancement}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </td>

                {/* Date début */}
                <td className="px-4 py-3 text-center">
                  {tournee.dateDebut ? (
                    <div className="flex items-center justify-center space-x-1 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(tournee.dateDebut).toLocaleDateString()}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center space-x-2">
                    {/* Bouton Affecter pour les tournées non affectées */}
                    {!tournee.agentNom && (
                      <button
                        onClick={() => openAffectationSimple(tournee)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-700 transition-colors"
                        title="Affecter un agent"
                      >
                        Affecter
                      </button>
                    )}
                    
                    {/* Icônes d'actions - TOUJOURS VISIBLES */}
                    <div className="flex space-x-1">
                      {/* Icône Voir */}
                      <button
                        onClick={() => handleView(tournee)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Icône Modifier */}
                      <button
                        onClick={() => handleEdit(tournee)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* Icône Supprimer */}
                      <button
                        onClick={() => handleDelete(tournee)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!data || data.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            Aucune tournée trouvée
          </div>
        )}
      </div>

      {/* Pagination en bas */}
      {data.length > 0 && (
        <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow">
          <div className="text-xs text-gray-500">
            {startIndex + 1}-{Math.min(endIndex, data.length)} sur {data.length} tournées
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Précédent</span>
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-8 h-8 rounded text-xs ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <span>Suivant</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* NOUVEAU Modal d'affectation avec recherche */}
      {showAffectation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {selectedTournees.length > 1 ? 'Affecter plusieurs tournées' : 'Affecter un agent'}
              </h2>
              <button
                onClick={() => {
                  setShowAffectation(false);
                  setSelectedAgent(null);
                  setSearchTerm('');
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
              {/* Informations sur les tournées */}
              <div className="bg-gray-50 rounded-lg p-4">
                {selectedTournees.length === 1 ? (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tournée sélectionnée</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {selectedTournee?.code || data.find(t => t.id === selectedTournees[0])?.code}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tournées sélectionnées</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {selectedTournees.length} tournées
                    </p>
                    <div className="mt-2 max-h-24 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-1">
                        {selectedTournees.map(id => {
                          const tournee = data.find(t => t.id === id);
                          return tournee ? (
                            <div key={id} className="flex items-center space-x-2 text-xs text-gray-600 bg-white px-2 py-1 rounded">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{tournee.code}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sélection d'agent avec recherche */}
              <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rechercher un agent
                  </label>
                  
                  {/* Champ de recherche */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Rechercher par nom ou matricule..."
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    {searchTerm && (
                      <button
                        onClick={clearSelection}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Agent sélectionné */}
                  {selectedAgent && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <User className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-blue-900">{selectedAgent.nom}</p>
                            <p className="text-sm text-blue-700">Matricule: {selectedAgent.matricule}</p>
                          </div>
                        </div>
                        <button
                          onClick={clearSelection}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Changer
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Liste des agents filtrés */}
                  {!selectedAgent && filteredAgents.length > 0 && (
                    <div className="mt-2 border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                      <div className="divide-y divide-gray-100">
                        {filteredAgents.map(agent => (
                          <button
                            key={agent.id}
                            onClick={() => handleAgentSelect(agent)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3"
                          >
                            <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{agent.nom}</p>
                              <p className="text-sm text-gray-500 truncate">Matricule: {agent.matricule}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Aucun résultat */}
                  {!selectedAgent && searchTerm && filteredAgents.length === 0 && (
                    <div className="mt-2 text-center py-8 text-gray-500 text-sm">
                      <User className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      Aucun agent trouvé pour "{searchTerm}"
                    </div>
                  )}

                  {/* Liste vide */}
                  {!selectedAgent && !searchTerm && filteredAgents.length === 0 && (
                    <div className="mt-2 text-center py-8 text-gray-500 text-sm">
                      <User className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      Aucun agent disponible
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowAffectation(false);
                    setSelectedAgent(null);
                    setSearchTerm('');
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={selectedTournees.length > 1 ? handleAffectationMultiple : handleAffectation}
                  disabled={!selectedAgent || loading}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Affectation...</span>
                    </>
                  ) : selectedTournees.length > 1 ? (
                    <span>Affecter {selectedTournees.length} tournées</span>
                  ) : (
                    <span>Affecter la tournée</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}