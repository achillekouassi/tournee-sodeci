import React, { useState } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { login as loginApi, LoginRequest, LoginResponse } from '../api/authService';
import { useNavigate } from 'react-router-dom';

export const AuthPage: React.FC = () => {
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const credentials: LoginRequest = { matricule, password };

    try {
      const response: LoginResponse = await loginApi(credentials);
      // Token déjà sauvegardé dans localStorage par authService
      // Redirection vers dashboard ou module principal
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Matricule ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
          </div>

          {/* Titre */}
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">
            SODECI Tournées
          </h1>
          <p className="text-sm text-gray-600 text-center mb-6">
            Connectez-vous à votre compte
          </p>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              label="Matricule"
              type="text"
              placeholder="Entrez votre matricule"
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              required
            />

            <Input
              label="Mot de passe"
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            {/* Bouton visible seulement si les deux champs sont remplis */}
            {matricule && password && (
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            )}
          </form>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Version 1.0.0 - © 2025 SODECI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
