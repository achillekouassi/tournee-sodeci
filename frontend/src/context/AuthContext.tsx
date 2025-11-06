import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  matricule: string;
  nom: string;
  prenoms: string;
  role: string;
  fonction: string;
  agence: string;
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

  const login = async (matricule: string, password: string): Promise<boolean> => {
    if (matricule && password) {
      setUser({
        id: '1',
        matricule,
        nom: 'Doe',
        prenoms: 'John',
        role: 'OPERATEUR_SUPERVISION',
        fonction: 'Opérateur',
        agence: 'AGC001'
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
