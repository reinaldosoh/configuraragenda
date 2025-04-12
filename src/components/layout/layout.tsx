import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout principal da aplicação
 */
function Layout({ children }: LayoutProps): JSX.Element {
  const location = useLocation();
  const isAdminRoute = location.pathname.includes('/configuraragenda');

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#39d2c0] text-white p-4 shadow-md">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold">Consultório Médico</h1>
        </div>
      </header>
      
      <main className="py-6">
        {children}
      </main>
    </div>
  );
}

export default Layout;
