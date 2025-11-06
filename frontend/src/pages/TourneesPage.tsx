// src/pages/TourneesPage.tsx

import React, { useState } from 'react';
import { TourneeNavbar } from '../components/tournees/TourneeNavbar';
import { TourneesView } from '../components/tournees/TourneesView';
import { AffectationsView } from '../components/tournees/AffectationsView';
import { CompteursView } from '../components/tournees/CompteursView';


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
    }
  };

  return (
    <div>
      <TourneeNavbar activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </div>
  );
};