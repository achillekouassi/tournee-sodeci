// src/pages/TourneesPage.tsx
import React, { useState } from 'react';
import { TourneeNavbar } from '../components/tournees/TourneeNavbar';
import { TourneesView } from '../components/tournees/TourneesView';
import { CompteursView } from '../components/tournees/CompteursView';
import { AffectationsView } from '../components/tournees/AffectationsView';


export const TourneesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tournees' | 'affectations' | 'compteurs'>('tournees');

  const renderContent = () => {
    switch (activeTab) {
      case 'tournees':
        return <TourneesView />;
      case 'affectations':
        return <AffectationsView />;
      case 'compteurs':
        return <CompteursView />;
      default:
        return <TourneesView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <TourneeNavbar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="mt-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};