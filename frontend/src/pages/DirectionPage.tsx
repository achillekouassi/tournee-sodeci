// src/pages/DirectionPage.tsx
import React, { useState } from 'react';
import { DirectionNavbar } from '../components/direction/DirectionNavbar';
import { DirectionRegionalesView } from '../components/direction/direction-regionale/DirectionRegionalesView';
import { AgencesView } from '../components/direction/agence/AgencesView';
import { AgentsView } from '../components/direction/agent/AgentsView';



export const DirectionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'directions-regionales' | 'agences' | 'agents'>('directions-regionales');

  const renderContent = () => {
    switch (activeTab) {
      case 'directions-regionales':
        return <DirectionRegionalesView />;
      case 'agences':
        return <AgencesView />;
      case 'agents':
        return <AgentsView />;
      default:
        return <DirectionRegionalesView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <DirectionNavbar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="mt-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};