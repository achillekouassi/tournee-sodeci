import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { TourneesPage } from './pages/TourneesPage';
import { Layout } from './components/dashboard/Layout';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [activeModule, setActiveModule] = useState('dashboard');

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardPage />;
      case 'tournees':
        return <TourneesPage />;
      case 'releves':
      case 'recouvrement':
      case 'agents':
      case 'statistiques':
      case 'parametres':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600">Module en cours de développement...</p>
          </div>
        );
      default:
        return <DashboardPage />;
    }
  };

  return (
    <Layout activeModule={activeModule} onModuleChange={setActiveModule}>
      {renderModule()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
