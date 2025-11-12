import { useState, useEffect } from 'react';
import { 
  FileText, Calendar, Users, Percent, X, Eye, Edit, Trash2, 
  ChevronLeft, ChevronRight, CheckSquare, Square, Search,
  Play, Lock, Unlock
} from 'lucide-react';

import { api } from '../services/api';

interface GFData {
  id: number;
  codeGF: string;
  description: string;
  typeFacturation?: string;
  statut: string;
  nombreTournees: number;
  nombreClients: number;
  clientsReleves: number;
  tauxAvancement: number;
  dateImport?: string;
  dateCloture?: string;
  annee?: number;
  mois?: number;
  nomFichier?: string;
}

interface GFPageProps {
  data: GFData[];
  token: string;
  reload: () => void;
  onViewGF?: (gfId: number) => void;
}

export function GFPage({ data, token, reload, onViewGF }: GFPageProps) {
  const [selectedGFs, setSelectedGFs] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // États pour les actions groupées
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('');

  // Debug logs
  useEffect(() => {
    console.log('📋 GFs sélectionnés:', selectedGFs);
  }, [selectedGFs]);

  // Calculs pour la pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  // Filtrage des données
  const filteredData = data.filter(gf =>
    gf.codeGF.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gf.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gf.typeFacturation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gestion de la sélection multiple
  const toggleGFSelection = (gfId: number) => {
    setSelectedGFs(prev => 
      prev.includes(gfId) 
        ? prev.filter(id => id !== gfId)
        : [...prev, gfId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedGFs.length === currentData.length) {
      setSelectedGFs([]);
    } else {
      setSelectedGFs(currentData.map(gf => gf.id));
    }
  };

  const isGFSelected = (gfId: number) => {
    return selectedGFs.includes(gfId);
  };

  const isAllSelected = () => {
    return currentData.length > 0 && selectedGFs.length === currentData.length;
  };

  const isSomeSelected = () => {
    return selectedGFs.length > 0 && selectedGFs.length < currentData.length;
  };

  // Gestion des statuts
  const handleStatusChange = async (gfId: number, action: string) => {
    setLoading(gfId);
    setError('');
    
    try {
      console.log(`🔄 Tentative ${action} sur GF ${gfId}`);

      if (action === 'demarrer') {
        await api.demarrerGF(token, gfId);
      } else if (action === 'terminer') {
        await api.terminerGF(token, gfId);
      } else if (action === 'cloturer') {
        await api.cloturerGF(token, gfId);
      } else if (action === 'rouvrir') {
        await api.rouvrirGF(token, gfId);
      }

      console.log(`✅ ${action} réussi pour GF ${gfId}`);
      reload();
      
    } catch (err: any) {
      console.error(`❌ Erreur ${action}:`, err);
      const errorMessage = err.message || `Erreur lors du ${action}`;
      setError(errorMessage);
      alert(`❌ ${errorMessage}`);
    } finally {
      setLoading(null);
    }
  };

  // Actions groupées
  const handleBulkAction = async () => {
    if (!selectedAction || selectedGFs.length === 0) return;

    setLoading(-1); // Loading pour action groupée
    try {
      for (const gfId of selectedGFs) {
        await handleStatusChange(gfId, selectedAction);
      }
      setShowActionModal(false);
      setSelectedGFs([]);
      setSelectedAction('');
    } finally {
      setLoading(null);
    }
  };

  // Gestion des actions
  const handleView = (gf: GFData) => {
    console.log('Tentative de navigation vers GF:', gf.id);
    if (onViewGF) {
      onViewGF(gf.id);
    } else {
      console.log('Voir GF:', gf);
      alert(`Détails du GF: ${gf.codeGF}\nID: ${gf.id}\nDescription: ${gf.description}`);
    }
  };

  const handleEdit = (gf: GFData) => {
    console.log('Modifier GF:', gf);
  };

  const handleDelete = async (gf: GFData) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le GF "${gf.codeGF}" ?`)) {
      try {
        console.log('Suppression GF:', gf.id);
        reload();
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'EN_COURS':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'TERMINE':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'CLOTURE':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'NON_DEMARRE':
        return 'Non démarré';
      case 'EN_COURS':
        return 'En cours';
      case 'TERMINE':
        return 'Terminé';
      case 'CLOTURE':
        return 'Clôturé';
      default:
        return statut;
    }
  };

  const getActionButtons = (gf: GFData) => {
    if (loading === gf.id) {
      return (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-1">
        {gf.statut === 'NON_DEMARRE' && (
          <button
            onClick={() => handleStatusChange(gf.id, 'demarrer')}
            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
            title="Démarrer"
          >
            <Play className="w-4 h-4" />
          </button>
        )}
        {gf.statut === 'EN_COURS' && (
          <button
            onClick={() => handleStatusChange(gf.id, 'terminer')}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Terminer"
          >
            <CheckSquare className="w-4 h-4" />
          </button>
        )}
        {gf.statut === 'TERMINE' && (
          <>
            <button
              onClick={() => handleStatusChange(gf.id, 'cloturer')}
              className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition-colors"
              title="Clôturer"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleStatusChange(gf.id, 'rouvrir')}
              className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
              title="Rouvrir"
            >
              <Unlock className="w-4 h-4" />
            </button>
          </>
        )}
        {gf.statut === 'CLOTURE' && (
          <button
            onClick={() => handleStatusChange(gf.id, 'rouvrir')}
            className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
            title="Rouvrir"
          >
            <Unlock  className="w-4 h-4" />
          </button>
        )}
      </div>
    );
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
        <h1 className="text-lg font-bold text-gray-800">Gestion des Groupes de Facturation</h1>
        <div className="text-xs text-gray-500">
          {data.length} GFs • {selectedGFs.length} sélectionné(s) • Page {currentPage} sur {totalPages}
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher par code, description ou type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Barre d'actions pour la sélection multiple */}
      {selectedGFs.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-blue-800">
                {selectedGFs.length} GF(s) sélectionné(s)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowActionModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded text-xs hover:bg-blue-700 transition-colors"
              >
                Actions groupées ({selectedGFs.length})
              </button>
              <button
                onClick={() => setSelectedGFs([])}
                className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-xs hover:bg-gray-200 transition-colors"
              >
                Tout désélectionner
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-red-700">
            <span className="text-sm">{error}</span>
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

      {/* Tableau des GFs */}
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
              <th className="px-4 py-3 text-left font-medium text-gray-700">Code GF</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Description</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Type</th>
              <th className="px-4 py-3 text-center font-medium text-gray-700">Statut</th>
              <th className="px-4 py-3 text-center font-medium text-gray-700">Tournées</th>
              <th className="px-4 py-3 text-center font-medium text-gray-700">Clients</th>
              <th className="px-4 py-3 text-center font-medium text-gray-700">Avancement</th>
              <th className="px-4 py-3 text-center font-medium text-gray-700">Date import</th>
              <th className="px-4 py-3 text-center font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentData.map(gf => (
              <tr key={gf.id} className="hover:bg-gray-50">
                {/* Case à cocher */}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleGFSelection(gf.id)}
                    className="flex items-center justify-center w-5 h-5 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    {isGFSelected(gf.id) ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </td>

                {/* Code GF */}
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-800">{gf.codeGF}</span>
                  </div>
                </td>

                {/* Description */}
                <td className="px-4 py-3 text-gray-600">
                  {gf.description}
                </td>

                {/* Type */}
                <td className="px-4 py-3">
                  <span className="text-gray-600">
                    {gf.typeFacturation || 'N/A'}
                  </span>
                </td>

                {/* Statut */}
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(gf.statut)}`}>
                    {getStatusText(gf.statut)}
                  </span>
                </td>

                {/* Tournées */}
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-800">
                      {gf.nombreTournees}
                    </span>
                  </div>
                </td>

                {/* Clients */}
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <span className="font-medium text-gray-800">
                      {gf.clientsReleves}
                    </span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600">{gf.nombreClients}</span>
                  </div>
                </td>

                {/* Avancement */}
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Percent className="w-4 h-4 text-gray-400" />
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">{gf.tauxAvancement?.toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            gf.tauxAvancement >= 80 ? 'bg-green-500' :
                            gf.tauxAvancement >= 50 ? 'bg-orange-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${gf.tauxAvancement}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </td>

                {/* Date import */}
                <td className="px-4 py-3 text-center">
                  {gf.dateImport ? (
                    <div className="flex items-center justify-center space-x-1 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(gf.dateImport).toLocaleDateString()}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center space-x-2">
                    {/* Actions de statut */}
                    {getActionButtons(gf)}
                    
                    {/* Icônes d'actions */}
                    <div className="flex space-x-1">
                      {/* Icône Voir */}
                      <button
                        onClick={() => handleView(gf)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Icône Modifier */}
                      <button
                        onClick={() => handleEdit(gf)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* Icône Supprimer */}
                      <button
                        onClick={() => handleDelete(gf)}
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
            Aucun groupe de facturation trouvé
          </div>
        )}
      </div>

      {/* Pagination en bas */}
      {data.length > 0 && (
        <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow">
          <div className="text-xs text-gray-500">
            {startIndex + 1}-{Math.min(endIndex, data.length)} sur {data.length} GFs
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

      {/* Modal d'actions groupées */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Actions groupées
              </h2>
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setSelectedAction('');
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700">GFs sélectionnés</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {selectedGFs.length} groupe(s) de facturation
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action à appliquer
                </label>
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner une action</option>
                  <option value="demarrer">Démarrer</option>
                  <option value="terminer">Terminer</option>
                  <option value="cloturer">Clôturer</option>
                  <option value="rouvrir">Rouvrir</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowActionModal(false);
                    setSelectedAction('');
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleBulkAction}
                  disabled={!selectedAction || loading === -1}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading === -1 ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Application...</span>
                    </>
                  ) : (
                    <span>Appliquer</span>
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