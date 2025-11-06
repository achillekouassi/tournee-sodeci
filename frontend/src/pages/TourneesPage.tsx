import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TourneeCard } from '../components/tournees/TourneeCard';
import { TourneeFilters } from '../components/tournees/TourneeFilters';

export const TourneesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState('');

  const tournees = [
    {
      id: '1',
      code: 'T-042',
      libelle: 'Cocody Angré - Zone résidentielle',
      agent: 'Jean Konan',
      dateAffectation: '06/01/2025',
      statut: 'TERMINEE' as const,
      progression: 100,
      compteursTotal: 245,
      compteursReleves: 245,
      anomalies: 3
    },
    {
      id: '2',
      code: 'T-038',
      libelle: 'Yopougon - Quartier Niangon',
      agent: 'Paul Mensah',
      dateAffectation: '06/01/2025',
      statut: 'EN_COURS' as const,
      progression: 67,
      compteursTotal: 235,
      compteursReleves: 158,
      anomalies: 5
    },
    {
      id: '3',
      code: 'T-051',
      libelle: 'Abobo - Zone commerciale',
      agent: 'Marie Diabaté',
      dateAffectation: '06/01/2025',
      statut: 'EN_COURS' as const,
      progression: 45,
      compteursTotal: 250,
      compteursReleves: 112,
      anomalies: 8
    },
    {
      id: '4',
      code: 'T-029',
      libelle: 'Plateau - Centre-ville',
      dateAffectation: '06/01/2025',
      statut: 'AFFECTEE' as const,
      progression: 0,
      compteursTotal: 180,
      compteursReleves: 0,
      anomalies: 0
    },
    {
      id: '5',
      code: 'T-067',
      libelle: 'Marcory - Zone 4',
      agent: 'Sophie Bamba',
      dateAffectation: '05/01/2025',
      statut: 'TERMINEE' as const,
      progression: 100,
      compteursTotal: 198,
      compteursReleves: 198,
      anomalies: 2
    },
    {
      id: '6',
      code: 'T-015',
      libelle: 'Koumassi - Grand marché',
      statut: 'SUSPENDUE' as const,
      progression: 30,
      compteursTotal: 220,
      compteursReleves: 66,
      anomalies: 12
    }
  ];

  const filteredTournees = tournees.filter(tournee => {
    const matchesSearch = tournee.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournee.libelle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatut = !statutFilter || tournee.statut === statutFilter;
    return matchesSearch && matchesStatut;
  });

  const handleViewDetails = (id: string) => {
    console.log('View details for tournee:', id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Tournées</h1>
          <p className="text-xs text-gray-600 mt-1">
            {filteredTournees.length} tournée(s) trouvée(s)
          </p>
        </div>
        <Button size="sm">
          <Plus size={16} className="mr-1" />
          Nouvelle tournée
        </Button>
      </div>

      <TourneeFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statutFilter={statutFilter}
        onStatutChange={setStatutFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTournees.map(tournee => (
          <TourneeCard
            key={tournee.id}
            tournee={tournee}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {filteredTournees.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-600">Aucune tournée trouvée</p>
        </div>
      )}
    </div>
  );
};
