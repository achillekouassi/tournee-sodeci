import { useState, useEffect } from 'react';
import { 
  ArrowLeft, MapPin, Calendar, User, Users, Percent, 
  FileText, AlertTriangle, CheckCircle, Clock, 
  ChevronDown, ChevronUp, Search, Filter,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { api } from '../services/api';

interface TourneeDetail {
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
  dateFin?: string;
  groupeFacturation: {
    id: number;
    codeGF: string;
    description: string;
    typeFacturation: string;
  };
}

interface Client {
  id: number;
  numeroFacture: string;
  nomMatriAZ: string;
  adresse: string;
  numeroCompteur: string;
  calibre: string;
  typeCompteur: string;
  statusClient: string;
  clientNom: string;
}

interface Releve {
  id: number;
  clientId: number;
  clientNom: string;
  ancienIndex: number;
  nouvelIndex?: number;
  dateReleve: string;
  casReleve: string;
  statut: string;
  anomalie?: {
    type: string;
    description: string;
    statut: string;
  };
}

interface TourneeDetailPageProps {
  token: string;
  tourneeId: number;
  onBack: () => void;
}

export function TourneeDetailPage({ token, tourneeId, onBack }: TourneeDetailPageProps) {
  const [tournee, setTournee] = useState<TourneeDetail | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [releves, setReleves] = useState<Releve[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // États pour les filtres et recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<string>('TOUS');
  const [showClients, setShowClients] = useState(true);
  const [showReleves, setShowReleves] = useState(true);

  // États pour la pagination des clients
  const [currentClientPage, setCurrentClientPage] = useState(1);
  const [clientsPerPage, setClientsPerPage] = useState(10);

  // États pour la pagination des relevés
  const [currentRelevePage, setCurrentRelevePage] = useState(1);
  const [relevesPerPage, setRelevesPerPage] = useState(10);

  useEffect(() => {
    if (tourneeId) {
      loadTourneeDetail();
    }
  }, [tourneeId, token]);

  const loadTourneeDetail = async () => {
    try {
      setLoading(true);
      setError('');

      // Charger les données de la tournée
      const tourneeData = await api.getTourneeDetail(token, tourneeId);
      setTournee(tourneeData);

      // Charger les clients
      const clientsData = await api.getClients(token, tourneeId);
      setClients(clientsData || []);

      // Charger les relevés
      const relevesData = await api.getReleves(token, tourneeId);
      setReleves(relevesData || []);

    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Erreur détaillée:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les clients - CORRIGÉ avec vérifications de sécurité
  const filteredClients = clients.filter(client => {
    if (!client) return false;
    
    const nom = client.numeroFacture || '';
    const nomMatriAZ = client.nomMatriAZ || '';
    const numeroCompteur = client.numeroCompteur || '';
    
    return (
      nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nomMatriAZ.toLowerCase().includes(searchTerm.toLowerCase()) ||
      numeroCompteur.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Filtrer les relevés - CORRIGÉ avec vérifications de sécurité
  const filteredReleves = releves.filter(releve => {
    if (!releve) return false;
    
    const clientNom = releve.clientNom || '';
    const matchesSearch = clientNom.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatut === 'TOUS') return matchesSearch;
    if (filterStatut === 'AVEC_ANOMALIE') return matchesSearch && releve.anomalie;
    if (filterStatut === 'NORMALE') return matchesSearch && !releve.anomalie;
    
    return matchesSearch && releve.statut === filterStatut;
  });

  // Pagination pour les clients
  const clientStartIndex = (currentClientPage - 1) * clientsPerPage;
  const clientEndIndex = clientStartIndex + clientsPerPage;
  const currentClients = filteredClients.slice(clientStartIndex, clientEndIndex);
  const totalClientPages = Math.ceil(filteredClients.length / clientsPerPage);

  // Pagination pour les relevés
  const releveStartIndex = (currentRelevePage - 1) * relevesPerPage;
  const releveEndIndex = releveStartIndex + relevesPerPage;
  const currentReleves = filteredReleves.slice(releveStartIndex, releveEndIndex);
  const totalRelevePages = Math.ceil(filteredReleves.length / relevesPerPage);

  // Fonctions de pagination pour les clients
  const goToClientPage = (page: number) => {
    setCurrentClientPage(Math.max(1, Math.min(page, totalClientPages)));
  };

  const nextClientPage = () => {
    if (currentClientPage < totalClientPages) {
      setCurrentClientPage(currentClientPage + 1);
    }
  };

  const prevClientPage = () => {
    if (currentClientPage > 1) {
      setCurrentClientPage(currentClientPage - 1);
    }
  };

  // Fonctions de pagination pour les relevés
  const goToRelevePage = (page: number) => {
    setCurrentRelevePage(Math.max(1, Math.min(page, totalRelevePages)));
  };

  const nextRelevePage = () => {
    if (currentRelevePage < totalRelevePages) {
      setCurrentRelevePage(currentRelevePage + 1);
    }
  };

  const prevRelevePage = () => {
    if (currentRelevePage > 1) {
      setCurrentRelevePage(currentRelevePage - 1);
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'EN_COURS': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'TERMINEE': return 'bg-green-100 text-green-700 border-green-200';
      case 'CLOTUREE': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'EN_COURS': return 'En cours';
      case 'TERMINEE': return 'Terminée';
      case 'CLOTUREE': return 'Clôturée';
      default: return 'Planifiée';
    }
  };

  const getAnomalieColor = (type: string) => {
    switch (type) {
      case 'CRITIQUE': return 'bg-red-100 text-red-700 border-red-200';
      case 'MAJEURE': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'MINEURE': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
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

  if (error || !tournee) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error || 'Tournée non trouvée'}</p>
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
            <h1 className="text-xl font-bold text-gray-800">{tournee.code}</h1>
            <p className="text-sm text-gray-600">{tournee.zone}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(tournee.statut)}`}>
          {getStatusText(tournee.statut)}
        </span>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Carte Groupe Facturation */}
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Groupe Facturation</p>
              <p className="text-lg font-semibold text-gray-800">{tournee.codeGF}</p>
              <p className="text-xs text-gray-500">{tournee.groupeFacturation?.description}</p>
            </div>
          </div>
        </div>

        {/* Carte Agent */}
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Agent</p>
              <p className="text-lg font-semibold text-gray-800">
                {tournee.agentNom || 'Non affecté'}
              </p>
              <p className="text-xs text-gray-500">
                {tournee.dateDebut ? `Début: ${new Date(tournee.dateDebut).toLocaleDateString()}` : 'Non démarrée'}
              </p>
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
                {tournee.clientsReleves}/{tournee.totalClients}
              </p>
              <p className="text-xs text-gray-500">
                {tournee.totalClients - tournee.clientsReleves} restants
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
                {tournee.tauxAvancement?.toFixed(1)}%
              </p>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
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
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un client ou un compteur..."
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
            <option value="TOUS">Tous les relevés</option>
            <option value="NORMALE">Relevés normaux</option>
            <option value="AVEC_ANOMALIE">Avec anomalies</option>
            <option value="EN_COURS">En cours</option>
            <option value="TERMINE">Terminés</option>
          </select>
        </div>
      </div>

      {/* Section Clients */}
      <div className="bg-white rounded-lg shadow border">
        <button
          onClick={() => setShowClients(!showClients)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">Liste des Clients</h2>
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
              {filteredClients.length}
            </span>
          </div>
          {showClients ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showClients && (
          <div className="border-t">
            {/* Contrôles de pagination pour les clients */}
            <div className="flex items-center justify-between bg-gray-50 p-3 border-b">
              <div className="flex items-center space-x-4">
                <label className="text-xs text-gray-700">
                  Afficher :
                  <select
                    value={clientsPerPage}
                    onChange={(e) => {
                      setClientsPerPage(Number(e.target.value));
                      setCurrentClientPage(1);
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
                  onClick={prevClientPage}
                  disabled={currentClientPage === 1}
                  className="p-1.5 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <span className="text-xs text-gray-600">
                  {clientStartIndex + 1}-{Math.min(clientEndIndex, filteredClients.length)} sur {filteredClients.length}
                </span>
                
                <button
                  onClick={nextClientPage}
                  disabled={currentClientPage === totalClientPages}
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
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Nom</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Client</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Compteur</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Calibre</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentClients.map(client => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{client.clientNom || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{client.nomMatriAZ || '-'}</td>
                      <td className="px-4 py-3 text-gray-600 font-mono">{client.numeroCompteur || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{client.calibre || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{client.typeCompteur || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          client.statusClient === 'ACTIF' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {client.statusClient || 'INCONNU'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination en bas pour les clients */}
            {filteredClients.length > 0 && (
              <div className="flex items-center justify-between bg-gray-50 p-3 border-t">
                <div className="text-xs text-gray-500">
                  {clientStartIndex + 1}-{Math.min(clientEndIndex, filteredClients.length)} sur {filteredClients.length} clients
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={prevClientPage}
                    disabled={currentClientPage === 1}
                    className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Précédent</span>
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalClientPages) }, (_, i) => {
                      let pageNum;
                      if (totalClientPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentClientPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentClientPage >= totalClientPages - 2) {
                        pageNum = totalClientPages - 4 + i;
                      } else {
                        pageNum = currentClientPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToClientPage(pageNum)}
                          className={`w-8 h-8 rounded text-xs ${
                            currentClientPage === pageNum
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
                    onClick={nextClientPage}
                    disabled={currentClientPage === totalClientPages}
                    className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <span>Suivant</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {filteredClients.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucun client trouvé
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section Relevés */}
      <div className="bg-white rounded-lg shadow border">
        <button
          onClick={() => setShowReleves(!showReleves)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">Relevés Effectués</h2>
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
              {filteredReleves.length}
            </span>
          </div>
          {showReleves ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showReleves && (
          <div className="border-t">
            {/* Contrôles de pagination pour les relevés */}
            <div className="flex items-center justify-between bg-gray-50 p-3 border-b">
              <div className="flex items-center space-x-4">
                <label className="text-xs text-gray-700">
                  Afficher :
                  <select
                    value={relevesPerPage}
                    onChange={(e) => {
                      setRelevesPerPage(Number(e.target.value));
                      setCurrentRelevePage(1);
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
                  onClick={prevRelevePage}
                  disabled={currentRelevePage === 1}
                  className="p-1.5 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <span className="text-xs text-gray-600">
                  {releveStartIndex + 1}-{Math.min(releveEndIndex, filteredReleves.length)} sur {filteredReleves.length}
                </span>
                
                <button
                  onClick={nextRelevePage}
                  disabled={currentRelevePage === totalRelevePages}
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
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Client</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Ancien Index</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Nouvel Index</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Date Relevé</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Statut</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Anomalie</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentReleves.map(releve => (
                    <tr key={releve.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{releve.clientNom || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{releve.ancienIndex?.toLocaleString() || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {releve.nouvelIndex ? releve.nouvelIndex.toLocaleString() : '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {releve.dateReleve ? new Date(releve.dateReleve).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          releve.statut === 'TERMINE' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {releve.statut === 'TERMINE' ? 'Terminé' : 'En cours'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {releve.anomalie ? (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getAnomalieColor(releve.anomalie.type)}`}>
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {releve.anomalie.type || 'ANOMALIE'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Normal
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination en bas pour les relevés */}
            {filteredReleves.length > 0 && (
              <div className="flex items-center justify-between bg-gray-50 p-3 border-t">
                <div className="text-xs text-gray-500">
                  {releveStartIndex + 1}-{Math.min(releveEndIndex, filteredReleves.length)} sur {filteredReleves.length} relevés
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={prevRelevePage}
                    disabled={currentRelevePage === 1}
                    className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Précédent</span>
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalRelevePages) }, (_, i) => {
                      let pageNum;
                      if (totalRelevePages <= 5) {
                        pageNum = i + 1;
                      } else if (currentRelevePage <= 3) {
                        pageNum = i + 1;
                      } else if (currentRelevePage >= totalRelevePages - 2) {
                        pageNum = totalRelevePages - 4 + i;
                      } else {
                        pageNum = currentRelevePage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToRelevePage(pageNum)}
                          className={`w-8 h-8 rounded text-xs ${
                            currentRelevePage === pageNum
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
                    onClick={nextRelevePage}
                    disabled={currentRelevePage === totalRelevePages}
                    className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <span>Suivant</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {filteredReleves.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucun relevé trouvé
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}