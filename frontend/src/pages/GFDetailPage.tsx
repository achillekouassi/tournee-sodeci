import { useState, useEffect } from 'react';
import { 
  ArrowLeft, FileText, Calendar, Users, Percent, 
  MapPin, CheckCircle, AlertTriangle, Clock,
  ChevronDown, ChevronUp, Search, Filter,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { api } from '../services/api';

interface GFDetail {
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
  moisDepart?: string;
  tournees: Tournee[]; // AJOUT: Les tournées sont incluses dans la réponse
}

interface Tournee {
  id: number;
  code: string;
  zone: string;
  statut: string;
  agentNom?: string;
  totalClients: number;
  clientsReleves: number;
  tauxAvancement: number;
  dateDebut?: string;
}

interface GFDetailPageProps {
  token: string;
  gfId: number;
  onBack: () => void;
}

export function GFDetailPage({ token, gfId, onBack }: GFDetailPageProps) {
  const [gf, setGF] = useState<GFDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // États pour les filtres et recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<string>('TOUS');
  const [showTournees, setShowTournees] = useState(true);

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    if (gfId) {
      loadGFDetail();
    }
  }, [gfId, token]);

  const loadGFDetail = async () => {
    try {
      setLoading(true);
      setError('');

      // Charger les données du GF (inclut les tournées)
      const gfData = await api.getGFDetail(token, gfId);
      console.log('📊 Données GF reçues:', gfData);
      console.log('🚗 Tournées reçues:', gfData.tournees);
      
      setGF(gfData);

    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Erreur détaillée:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les tournées - CORRIGÉ avec gestion des données null/undefined
  const filteredTournees = gf?.tournees?.filter(tournee => {
    if (!tournee) return false;
    
    const matchesSearch = 
      (tournee.code?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (tournee.zone?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (tournee.agentNom?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    if (filterStatut === 'TOUS') return matchesSearch;
    return matchesSearch && tournee.statut === filterStatut;
  }) || [];

  // Pagination - CORRIGÉ avec valeurs par défaut
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTournees = filteredTournees.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredTournees.length / itemsPerPage);

  // Fonctions de pagination
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

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'EN_COURS': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'TERMINE': return 'bg-green-100 text-green-700 border-green-200';
      case 'CLOTURE': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'NON_DEMARRE': return 'Non démarré';
      case 'EN_COURS': return 'En cours';
      case 'TERMINE': return 'Terminé';
      case 'CLOTURE': return 'Clôturé';
      default: return statut;
    }
  };

  const getTourneeStatusColor = (statut: string) => {
    switch (statut) {
      case 'EN_COURS': 
      case 'NON_DEMARREE': // AJOUT: Gestion du statut "NON_DEMARREE"
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'TERMINEE': return 'bg-green-100 text-green-700 border-green-200';
      case 'CLOTUREE': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getTourneeStatusText = (statut: string) => {
    switch (statut) {
      case 'EN_COURS': return 'En cours';
      case 'NON_DEMARREE': return 'Non démarrée'; // AJOUT: Traduction
      case 'TERMINEE': return 'Terminée';
      case 'CLOTUREE': return 'Clôturée';
      default: return statut || 'Inconnu';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error || !gf) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error || 'Groupe de facturation non trouvé'}</p>
        <button
          onClick={onBack}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{gf.codeGF}</h1>
            <p className="text-sm text-gray-600">{gf.description}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(gf.statut)}`}>
          {getStatusText(gf.statut)}
        </span>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Carte Type Facturation */}
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Type Facturation</p>
              <p className="text-lg font-semibold text-gray-800">{gf.typeFacturation || 'N/A'}</p>
              <p className="text-xs text-gray-500">{gf.moisDepart || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Carte Tournées */}
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Tournées</p>
              <p className="text-lg font-semibold text-gray-800">{gf.nombreTournees}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>

        {/* Carte Clients */}
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Clients</p>
              <p className="text-lg font-semibold text-gray-800">
                {gf.clientsReleves}/{gf.nombreClients}
              </p>
              <p className="text-xs text-gray-500">
                {gf.nombreClients - gf.clientsReleves} restants
              </p>
            </div>
          </div>
        </div>

        {/* Carte Avancement */}
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Percent className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Avancement</p>
              <p className="text-lg font-semibold text-gray-800">
                {gf.tauxAvancement?.toFixed(1)}%
              </p>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                <div
                  className={`h-full rounded-full ${
                    gf.tauxAvancement >= 80 ? 'bg-green-500' :
                    gf.tauxAvancement >= 50 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(gf.tauxAvancement, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informations détaillées */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Informations détaillées</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Année:</span>
              <p className="font-medium">{gf.annee || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-500">Mois:</span>
              <p className="font-medium">{gf.mois || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-500">Date import:</span>
              <p className="font-medium">
                {gf.dateImport ? new Date(gf.dateImport).toLocaleString() : 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Date clôture:</span>
              <p className="font-medium">
                {gf.dateCloture ? new Date(gf.dateCloture).toLocaleString() : 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Fichier source:</span>
              <p className="font-medium text-xs">{gf.nomFichier || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-500">Mois départ:</span>
              <p className="font-medium">{gf.moisDepart || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une tournée, zone ou agent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="TOUS">Toutes les tournées</option>
            <option value="NON_DEMARREE">Non démarrées</option>
            <option value="EN_COURS">En cours</option>
            <option value="TERMINEE">Terminées</option>
            <option value="CLOTUREE">Clôturées</option>
          </select>
        </div>
      </div>

      {/* Section Tournées */}
      <div className="bg-white rounded-lg shadow border">
        <button
          onClick={() => setShowTournees(!showTournees)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">Tournées du GF</h2>
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
              {filteredTournees.length} / {gf.tournees?.length || 0}
            </span>
          </div>
          {showTournees ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showTournees && (
          <div className="border-t">
            {/* Contrôles de pagination */}
            <div className="flex items-center justify-between bg-gray-50 p-3 border-b">
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
                <span className="text-xs text-gray-500">
                  {filteredTournees.length} tournée(s) trouvée(s)
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <span className="text-xs text-gray-600">
                  {startIndex + 1}-{Math.min(endIndex, filteredTournees.length)} sur {filteredTournees.length}
                </span>
                
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages || filteredTournees.length === 0}
                  className="p-1.5 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Tournée</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Zone</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Agent</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-700">Clients</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-700">Avancement</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-700">Statut</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-700">Date début</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentTournees.length > 0 ? (
                    currentTournees.map(tournee => (
                      <tr key={tournee.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{tournee.code || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{tournee.zone || 'N/A'}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {tournee.agentNom || <span className="text-gray-400 italic">Non affecté</span>}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600">
                          <span className="font-medium">{tournee.clientsReleves || 0}</span>
                          <span className="text-gray-400">/</span>
                          <span>{tournee.totalClients || 0}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  (tournee.tauxAvancement || 0) >= 80 ? 'bg-green-500' :
                                  (tournee.tauxAvancement || 0) >= 50 ? 'bg-orange-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${Math.min(tournee.tauxAvancement || 0, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600 font-medium min-w-[35px] text-right">
                              {(tournee.tauxAvancement || 0)?.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTourneeStatusColor(tournee.statut)}`}>
                            {getTourneeStatusText(tournee.statut)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600">
                          {tournee.dateDebut ? (
                            <div className="flex items-center justify-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(tournee.dateDebut).toLocaleDateString()}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        {gf.tournees?.length === 0 ? 'Aucune tournée trouvée pour ce GF' : 'Aucune tournée ne correspond aux critères de recherche'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination en bas */}
            {filteredTournees.length > 0 && (
              <div className="flex items-center justify-between bg-gray-50 p-3 border-t">
                <div className="text-xs text-gray-500">
                  {startIndex + 1}-{Math.min(endIndex, filteredTournees.length)} sur {filteredTournees.length} tournées
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
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
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages || filteredTournees.length === 0}
                    className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <span>Suivant</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}