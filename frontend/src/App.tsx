import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { TourneesPage } from './pages/TourneesPage';
import { Layout } from './components/dashboard/Layout';

const getRoleLabel = (role?: string) => {
  switch (role) {
    case 'ADMIN': return 'Administrateur';
    case 'OPERATEUR_SUPERVISION': return 'Superviseur';
    case 'AGENT_TERRAIN': return 'Agent Terrain';
    case 'AGENT_ZONE': return 'Agent Zone';
    default: return '';
  }
};

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [activeModule, setActiveModule] = useState('dashboard');

  if (!isAuthenticated) return <AuthPage />;

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard': return <DashboardPage />;
      case 'tournees': return <TourneesPage />;
      default:
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600">Module en cours de développement...</p>
          </div>
        );
    }
  };

  return (
    <Layout
      activeModule={activeModule}
      onModuleChange={setActiveModule}
      userName={`${user?.prenoms} ${user?.nom}`}
      userRole={getRoleLabel(user?.role)}
    >
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
