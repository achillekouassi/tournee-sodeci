import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { GFPage } from './pages/GFPage';
import { GFDetailPage } from './pages/GFDetailPage'; // AJOUT: Importer GFDetailPage
import { TourneesPage } from './pages/TourneesPage';
import { TourneeDetailPage } from './pages/TourneeDetailPage';
import { ClientsPage } from './pages/ClientsPage';
import { RelevesPage } from './pages/RelevesPage';
import { AnomaliesPage } from './pages/AnomaliesPage';
import { UsersPage } from './pages/UsersPage';
import { api } from './services/api';

export interface AuthData {
  token: string;
  nom: string;
  role: string;
  userId: number;
}

export default function App() {
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [page, setPage] = useState('dashboard');
  const [selectedTourneeId, setSelectedTourneeId] = useState<number | null>(null);
  const [selectedGFId, setSelectedGFId] = useState<number | null>(null); // AJOUT: État pour GF sélectionné
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [gfList, setGfList] = useState([]);
  const [tournees, setTournees] = useState([]);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [releves, setReleves] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      setAuth(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (auth?.token) {
      loadData();
    }
  }, [auth, page]);

  const loadData = async () => {
    if (!auth?.token) return;

    setLoading(true);
    try {
      if (page === 'dashboard') {
        const d = await api.getDashboard(auth.token);
        setDashboard(d);
      } else if (page === 'gf') {
        const g = await api.getGF(auth.token);
        setGfList(g);
      } else if (page === 'tournees') {
        const t = await api.getTournees(auth.token);
        setTournees(t);
      } else if (page === 'users') {
        const u = await api.getUtilisateurs(auth.token);
        setUsers(u);
      } else if (page === 'clients') {
        const c = await api.getClients(auth.token);
        setClients(c);
      } else if (page === 'releves') {
        const r = await api.getReleves(auth.token);
        setReleves(r);
      } else if (page === 'anomalies') {
        const a = await api.getAnomalies(auth.token);
        setAnomalies(a);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // AJOUT: Gestion de la navigation vers les détails d'un GF
  const handleViewGF = (gfId: number) => {
    console.log('Navigation vers GF ID:', gfId);
    setSelectedGFId(gfId);
    setPage('gf-detail');
  };

  // AJOUT: Retour à la liste des GFs
  const handleBackToGFList = () => {
    setSelectedGFId(null);
    setPage('gf');
  };

  const handleViewTournee = (tourneeId: number) => {
    console.log('Navigation vers tournée ID:', tourneeId);
    setSelectedTourneeId(tourneeId);
    setPage('tournee-detail');
  };

  const handleBackToList = () => {
    setSelectedTourneeId(null);
    setPage('tournees');
  };

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem('auth');
  };

  if (!auth) {
    return <LoginPage setAuth={setAuth} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 text-xs">
      <Sidebar 
        open={sidebarOpen} 
        page={page} 
        setPage={(newPage) => {
          if (newPage !== 'tournee-detail' && newPage !== 'gf-detail') {
            setSelectedTourneeId(null);
            setSelectedGFId(null);
          }
          setPage(newPage);
        }} 
        onLogout={handleLogout}
        user={auth}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          user={auth}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-auto p-3">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : page === 'dashboard' ? (
            <DashboardPage data={dashboard} />
          ) : page === 'gf' ? (
            <GFPage 
              data={gfList} 
              token={auth.token} 
              reload={loadData}
              onViewGF={handleViewGF} // AJOUT: Passer la fonction de navigation
            />
          ) : page === 'gf-detail' && selectedGFId ? ( // AJOUT: Condition pour GFDetailPage
            <GFDetailPage 
              token={auth.token}
              gfId={selectedGFId}
              onBack={handleBackToGFList}
            />
          ) : page === 'tournees' ? (
            <TourneesPage 
              data={tournees} 
              token={auth.token} 
              reload={loadData}
              onViewTournee={handleViewTournee}
            />
          ) : page === 'tournee-detail' && selectedTourneeId ? (
            <TourneeDetailPage 
              token={auth.token}
              tourneeId={selectedTourneeId}
              onBack={handleBackToList}
            />
          )  : page === 'anomalies' ? (
            <AnomaliesPage data={anomalies} token={auth.token} reload={loadData} />
          ) : (
            <UsersPage data={users} token={auth.token} reload={loadData} />
          )}
        </main>
      </div>
    </div>
  );
}