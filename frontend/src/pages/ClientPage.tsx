// src/pages/ClientPage.tsx
import React, { useState } from 'react';
import { ClientsView } from '../components/client/ClientsView';



export const ClientPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'clients'>('clients');

  const renderContent = () => {
    switch (activeTab) {
      case 'clients':
        return <ClientsView />;
      default:
        return <ClientsView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mt-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};