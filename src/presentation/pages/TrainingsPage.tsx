import React from 'react';
import { Header, Sidebar, Footer } from '../shared';
import { TrainingsList } from '../features/trainings';

export function TrainingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <TrainingsList />
        </main>
      </div>
      <Footer />
    </div>
  );
}
