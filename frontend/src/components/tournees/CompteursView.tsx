// src/pages/tournees/CompteursView.tsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, User, MapPin, Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { TourneeCompteurDTO } from '../../types/tourneeCompteur';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { tourneeCompteurService } from '../../api/tourneeCompteurService';


export const CompteursView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tourneeFilter, setTourneeFilter] = useState('');
  const [releveFilter, setReleveFilter] = useState('');
  const [compteurs, setCompteurs] = useState<TourneeCompteurDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

const loadCompteurs = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await tourneeCompteurService.getAllTourneeCompteurs();

    // Typage explicite pour forcer TS à comprendre
    const data: TourneeCompteurDTO[] = Array.isArray(response.data)
      ? response.data
      : Array.isArray((response.data as { content?: TourneeCompteurDTO[] }).content)
      ? (response.data as { content?: TourneeCompteurDTO[] }).content!
      : [];

    setCompteurs(data);
  } catch (err) {
    console.error('Erreur lors du chargement des compteurs:', err);
    setError('Impossible de charger les compteurs. Vérifiez votre connexion.');
    setCompteurs([]);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};



  useEffect(() => {
    loadCompteurs();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadCompteurs();
  };

  const filteredCompteurs = compteurs.filter(c => {
    const matchesSearch = 
      c.numeroCompteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.codeAt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.clientNom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.adresse?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tourneeCode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTournee = !tourneeFilter || c.tourneeCode === tourneeFilter;
    const matchesReleve = 
      releveFilter === '' ||
      (releveFilter === 'true' && c.estReleve) ||
      (releveFilter === 'false' && !c.estReleve);
    return matchesSearch && matchesTournee && matchesReleve;
  });

  const handleMarquerReleve = async (id: number) => {
    try {
      const position = await getCurrentPosition();
      await tourneeCompteurService.marquerCommeReleve(
        id, 
        position?.latitude, 
        position?.longitude
      );
      await loadCompteurs();
    } catch (err) {
      console.error('Erreur lors du marquage comme relevé:', err);
      alert('Erreur lors du marquage du compteur');
    }
  };

  const handleMarquerAnomalie = async (id: number) => {
    try {
      const compteur = compteurs.find(c => c.id === id);
      await tourneeCompteurService.marquerAnomalie(id, !compteur?.aAnomalie);
      await loadCompteurs();
    } catch (err) {
      console.error('Erreur lors du marquage anomalie:', err);
      alert('Erreur lors du marquage anomalie');
    }
  };

  const getCurrentPosition = (): Promise<{latitude: number, longitude: number} | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Géolocalisation non supportée');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Erreur de géolocalisation:', error);
          resolve(null);
        },
        { timeout: 10000 }
      );
    });
  };

  const tourneeCodes = [...new Set(compteurs.map(c => c.tourneeCode).filter(Boolean))];

  const CompteurCard: React.FC<{
    compteur: TourneeCompteurDTO;
    onMarquerReleve: (id: number) => void;
    onMarquerAnomalie: (id: number) => void;
  }> = ({ compteur, onMarquerReleve, onMarquerAnomalie }) => {
    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-sm font-semibold text-gray-800">
                {compteur.numeroCompteur}
              </h3>
              {compteur.estReleve ? (
                <Badge variant="green">
                  <CheckCircle size={12} className="inline mr-1" />
                  Relevé
                </Badge>
              ) : (
                <Badge variant="gray">Non relevé</Badge>
              )}
              {compteur.aAnomalie && (
                <Badge variant="orange">
                  <AlertCircle size={12} className="inline mr-1" />
                  Anomalie
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-600">
              AT: {compteur.codeAt} • {compteur.tourneeCode}
            </p>
          </div>
          {compteur.ordrePassage && (
            <span className="flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
              {compteur.ordrePassage}
            </span>
          )}
        </div>

        {compteur.clientNom && (
          <div className="space-y-2 mb-4 text-xs">
            <div className="flex items-start space-x-2 text-gray-700">
              <User size={12} className="mt-0.5 flex-shrink-0" />
              <span className="font-medium">{compteur.clientNom}</span>
            </div>
            {compteur.adresse && (
              <div className="flex items-start space-x-2 text-gray-600">
                <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                <span>{compteur.adresse}</span>
              </div>
            )}
            {compteur.referenceContrat && (
              <div className="text-gray-500">
                Contrat: {compteur.referenceContrat}
              </div>
            )}
          </div>
        )}

        {compteur.dateReleve && (
          <div className="mb-4 text-xs text-gray-600 flex items-center">
            <Clock size={12} className="mr-1" />
            Relevé le {new Date(compteur.dateReleve).toLocaleString('fr-FR')}
          </div>
        )}

        <div className="flex space-x-2">
          {!compteur.estReleve && (
            <Button 
              size="sm" 
              className="flex-1" 
              onClick={() => compteur.id && onMarquerReleve(compteur.id)}
            >
              <CheckCircle size={14} className="mr-1" />
              Marquer relevé
            </Button>
          )}
          <Button
            size="sm"
            variant={compteur.aAnomalie ? "danger" : "secondary"}
            onClick={() => compteur.id && onMarquerAnomalie(compteur.id)}
            title={compteur.aAnomalie ? "Retirer l'anomalie" : "Signaler une anomalie"}
          >
            <AlertCircle size={14} />
          </Button>
        </div>
      </Card>
    );
  };

  const stats = {
    total: compteurs.length,
    releves: compteurs.filter(c => c.estReleve).length,
    nonReleves: compteurs.filter(c => !c.estReleve).length,
    anomalies: compteurs.filter(c => c.aAnomalie).length
  };

  if (loading && !refreshing) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        <span className="ml-2 text-gray-600">Chargement des compteurs...</span>
      </div>
    );
  }

  if (error && compteurs.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700 mb-4">{error}</p>
        <Button onClick={loadCompteurs}>
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Compteurs de Tournée</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredCompteurs.length} compteur(s) trouvé(s)
          </p>
        </div>
        <Button 
          variant="secondary" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw size={16} className={`mr-1 ${refreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <p className="text-xs text-gray-600 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-xs text-gray-600 mb-1">Relevés</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.releves}</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-xs text-gray-600 mb-1">Non relevés</p>
          <p className="text-2xl font-bold text-gray-600">{stats.nonReleves}</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-xs text-gray-600 mb-1">Anomalies</p>
          <p className="text-2xl font-bold text-orange-600">{stats.anomalies}</p>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={16} 
            />
            <input
              type="text"
              placeholder="Rechercher par numéro, AT, client, adresse ou tournée..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={tourneeFilter}
              onChange={e => setTourneeFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Toutes les tournées</option>
              {tourneeCodes.map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
            <select
              value={releveFilter}
              onChange={e => setReleveFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Tous les statuts</option>
              <option value="true">Relevés</option>
              <option value="false">Non relevés</option>
            </select>
          </div>
        </div>
      </Card>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompteurs.map(compteur => (
          <CompteurCard
            key={compteur.id}
            compteur={compteur}
            onMarquerReleve={handleMarquerReleve}
            onMarquerAnomalie={handleMarquerAnomalie}
          />
        ))}
      </div>

      {filteredCompteurs.length === 0 && !loading && (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="max-w-md mx-auto">
            <Search size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun compteur trouvé</h3>
            <p className="text-gray-500">
              {searchTerm || tourneeFilter || releveFilter
                ? "Aucun compteur ne correspond à vos critères de recherche." 
                : "Aucun compteur n'est disponible pour le moment."
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};