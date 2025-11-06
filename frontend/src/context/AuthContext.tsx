import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as loginApi, LoginRequest, LoginResponse } from '../api/authService';

interface User {
  id: number;
  matricule: string;
  nom: string;
  prenoms: string;
  role: string;
  fonction?: string;
  agence?: string;
}

interface AuthContextType {
  user: User | null;
  login: (matricule: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // 🔹 Restaurer user depuis le localStorage au chargement
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (matricule: string, password: string): Promise<boolean> => {
    try {
      const data: LoginResponse = await loginApi({ matricule, password } as LoginRequest);
      if (data && data.token) {
        const newUser: User = {
          id: data.id,
          matricule: data.matricule,
          nom: data.nom,
          prenoms: data.prenoms,
          role: data.role,
          fonction: data.role,
          agence: data.agenceLibelle || '',
        };
        setUser(newUser);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(newUser)); // 🔹 sauvegarde user
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // 🔹 supprimer user
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
