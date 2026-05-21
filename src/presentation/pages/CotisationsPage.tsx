import React from 'react';
import { Header, Sidebar, Footer } from '../shared';
import { CotisationsList } from '../features/cotisations';

export function CotisationsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <CotisationsList />
        </main>
      </div>
      <Footer />
    </div>
  );
}
