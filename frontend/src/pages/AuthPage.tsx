import React, { useState } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { login as loginApi, LoginRequest, LoginResponse } from '../api/authService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AuthPage: React.FC = () => {
  const [form, setForm] = useState({ matricule: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data: LoginResponse = await loginApi(form as LoginRequest);

      if (data.token) {
        const success = await login(data.matricule, form.password);
        if (success) {
          navigate('/dashboard');
        } else {
          setError('Impossible de se connecter');
        }
      } else {
        setError('Aucun token reçu du serveur');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Matricule ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = form.matricule && form.password;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">S</div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">SODECI Tournées</h1>
        <p className="text-sm text-gray-600 text-center mb-6">Connectez-vous à votre compte</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            name="matricule"
            label="Matricule"
            placeholder="Entrez votre matricule"
            value={form.matricule}
            onChange={handleChange}
            required
          />
          <Input
            name="password"
            label="Mot de passe"
            type="password"
            placeholder="Entrez votre mot de passe"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && (
            <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
              {error}
            </div>
          )}

          {canSubmit && (
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          )}
        </form>

        <p className="mt-4 text-center text-xs text-gray-500">Version 1.0.0 - © 2025 SODECI</p>
      </div>
    </div>
  );
};
