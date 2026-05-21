import React from 'react';
import { Header, Sidebar, Footer } from '../shared';
import { MatchesList } from '../features/matches';

export function MatchesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <MatchesList />
        </main>
      </div>
      <Footer />
    </div>
  );
}
