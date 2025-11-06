// src/pages/tournees/CompteursView.tsx

import React, { useState } from 'react';
import { Search, Filter, User, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { TourneeCompteurDTO } from '../../types/tourneeCompteur';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const CompteursView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tourneeFilter, setTourneeFilter] = useState('');
  const [releveFilter, setReleveFilter] = useState('');

  // Données de démonstration
  const [compteurs] = useState<TourneeCompteurDTO[]>([
    {
      id: 1,
      tourneeId: 1,
      tourneeCode: 'T-042',
      compteurId: 1,
      numeroCompteur: 'C123456',
      codeAt: 'AT001',
      ordrePassage: 1,
      estReleve: true,
      dateReleve: '2025-01-06T09:30:00',
      aAnomalie: false,
      clientNom: 'Kouassi Martin',
      adresse: 'Angré 8ème tranche, Lot 245',
      referenceContrat: 'CT-2024-001'
    },
    {
      id: 2,
      tourneeId: 1,
      tourneeCode: 'T-042',
      compteurId: 2,
      numeroCompteur: 'C123457',
      codeAt: 'AT002',
      ordrePassage: 2,
      estReleve: true,
      dateReleve: '2025-01-06T09:45:00',
      aAnomalie: true,
      clientNom: 'Bamba Sophie',
      adresse: 'Angré 8ème tranche, Lot 250',
      referenceContrat: 'CT-2024-002'
    },
    {
      id: 3,
      tourneeId: 2,
      tourneeCode: 'T-038',
      compteurId: 3,
      numeroCompteur: 'C123458',
      codeAt: 'AT003',
      ordrePassage: 1,
      estReleve: false,
      aAnomalie: false,
      clientNom: 'Koné Abdoulaye',
      adresse: 'Yopougon Niangon, Rue 12',
      referenceContrat: 'CT-2024-003'
    },
    {
      id: 4,
      tourneeId: 2,
      tourneeCode: 'T-038',
      compteurId: 4,
      numeroCompteur: 'C123459',
      codeAt: 'AT004',
      ordrePassage: 2,
      estReleve: false,
      aAnomalie: false,
      clientNom: 'Traoré Ibrahim',
      adresse: 'Yopougon Niangon, Rue 15',
      referenceContrat: 'CT-2024-004'
    },
    {
      id: 5,
      tourneeId: 1,
      tourneeCode: 'T-042',
      compteurId: 5,
      numeroCompteur: 'C123460',
      codeAt: 'AT005',
      ordrePassage: 3,
      estReleve: true,
      dateReleve: '2025-01-06T10:00:00',
      aAnomalie: false,
      clientNom: 'Diallo Fatoumata',
      adresse: 'Angré 8ème tranche, Lot 260',
      referenceContrat: 'CT-2024-005'
    },
    {
      id: 6,
      tourneeId: 3,
      tourneeCode: 'T-051',
      compteurId: 6,
      numeroCompteur: 'C123461',
      codeAt: 'AT006',
      ordrePassage: 1,
      estReleve: false,
      aAnomalie: false,
      clientNom: 'Yao Bernard',
      adresse: 'Abobo, Marché centrale',
      referenceContrat: 'CT-2024-006'
    },
    {
      id: 7,
      tourneeId: 2,
      tourneeCode: 'T-038',
      compteurId: 7,
      numeroCompteur: 'C123462',
      codeAt: 'AT007',
      ordrePassage: 3,
      estReleve: true,
      dateReleve: '2025-01-06T11:15:00',
      aAnomalie: true,
      clientNom: 'Kouadio Marie',
      adresse: 'Yopougon Niangon, Rue 20',
      referenceContrat: 'CT-2024-007'
    },
    {
      id: 8,
      tourneeId: 1,
      tourneeCode: 'T-042',
      compteurId: 8,
      numeroCompteur: 'C123463',
      codeAt: 'AT008',
      ordrePassage: 4,
      estReleve: false,
      aAnomalie: false,
      clientNom: 'N\'Guessan Paul',
      adresse: 'Angré 8ème tranche, Lot 270',
      referenceContrat: 'CT-2024-008'
    }
  ]);

  const filteredCompteurs = compteurs.filter(c => {
    const matchesSearch = 
      c.numeroCompteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.codeAt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.clientNom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.adresse?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTournee = !tourneeFilter || c.tourneeCode === tourneeFilter;
    const matchesReleve = 
      releveFilter === '' ||
      (releveFilter === 'true' && c.estReleve) ||
      (releveFilter === 'false' && !c.estReleve);
    return matchesSearch && matchesTournee && matchesReleve;
  });

  const handleMarquerReleve = (id: number) => {
    console.log('Marquer relevé:', id);
    // Appeler marquerCommeReleve(id, latitude, longitude)
  };

  const handleMarquerAnomalie = (id: number) => {
    const compteur = compteurs.find(c => c.id === id);
    console.log('Toggle anomalie:', id, !compteur?.aAnomalie);
    // Appeler marquerAnomalie(id, !compteur?.aAnomalie)
  };

  // Composant CompteurCard
  const CompteurCard: React.FC<{
    compteur: TourneeCompteurDTO;
    onMarquerReleve: (id: number) => void;
    onMarquerAnomalie: (id: number) => void;
  }> = ({ compteur, onMarquerReleve, onMarquerAnomalie }) => {
    return (
      <Card>
        <div className="flex items-start justify-between mb-3">
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
          <div className="space-y-1 mb-3 text-xs">
            <div className="flex items-start space-x-2 text-gray-700">
              <User size={12} className="mt-0.5 flex-shrink-0" />
              <span>{compteur.clientNom}</span>
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

        {compteur.aAnomalie && (
          <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700 flex items-center">
            <AlertCircle size={14} className="mr-2 flex-shrink-0" />
            Anomalie détectée
          </div>
        )}

        {compteur.dateReleve && (
          <div className="mb-3 text-xs text-gray-600 flex items-center">
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

  // Statistiques
  const stats = {
    total: compteurs.length,
    releves: compteurs.filter(c => c.estReleve).length,
    nonReleves: compteurs.filter(c => !c.estReleve).length,
    anomalies: compteurs.filter(c => c.aAnomalie).length
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Compteurs de tournée</h2>
          <p className="text-xs text-gray-600 mt-1">
            {filteredCompteurs.length} compteur(s) trouvé(s)
          </p>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <Card className="text-center">
          <p className="text-xs text-gray-600 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-gray-600 mb-1">Relevés</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.releves}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-gray-600 mb-1">Non relevés</p>
          <p className="text-2xl font-bold text-gray-600">{stats.nonReleves}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-gray-600 mb-1">Anomalies</p>
          <p className="text-2xl font-bold text-orange-600">{stats.anomalies}</p>
        </Card>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={16} 
            />
            <input
              type="text"
              placeholder="Rechercher par numéro, AT, client ou adresse..."
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
              <option value="T-042">T-042</option>
              <option value="T-038">T-038</option>
              <option value="T-051">T-051</option>
            </select>
            <select
              value={releveFilter}
              onChange={e => setReleveFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Tous</option>
              <option value="true">Relevés</option>
              <option value="false">Non relevés</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des compteurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompteurs.map(compteur => (
          <CompteurCard
            key={compteur.id}
            compteur={compteur}
            onMarquerReleve={handleMarquerReleve}
            onMarquerAnomalie={handleMarquerAnomalie}
          />
        ))}
      </div>

      {filteredCompteurs.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-600">Aucun compteur trouvé</p>
        </div>
      )}
    </div>
  );
};