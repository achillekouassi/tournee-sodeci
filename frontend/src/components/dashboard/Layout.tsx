import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from '../ui/Navbar';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  activeModule: string;
  onModuleChange: (moduleId: string) => void;
  userName?: string;
  userRole?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeModule, onModuleChange, userName, userRole }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        activeModule={activeModule}
        onModuleChange={onModuleChange}
        userName={userName}
        userRole={userRole}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={logout}
          userName={userName}
          userRole={userRole}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
