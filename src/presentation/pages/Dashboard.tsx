import React from 'react';
import { Header, Sidebar, Footer } from '../shared';

export function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* À compléter avec les composants de statistiques */}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
