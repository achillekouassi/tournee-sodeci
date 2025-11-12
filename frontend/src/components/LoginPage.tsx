import { Dispatch, SetStateAction, useState } from 'react';
import { Home } from 'lucide-react';
import { api } from '../services/api';
import { AuthData } from '../App';

interface LoginPageProps {
  setAuth: Dispatch<SetStateAction<AuthData | null>>;
}

export function LoginPage({ setAuth }: LoginPageProps) {
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await api.login(matricule, password);
      setAuth(data);
      localStorage.setItem('auth', JSON.stringify(data));
    } catch {
      setError('Matricule ou mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center">
            <Home className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-800">Gestion des Relevés</h1>
          <p className="text-xs text-gray-500 mt-1">Connectez-vous à votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Matricule</label>
            <input
              type="text"
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Votre matricule"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition text-xs font-medium"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
