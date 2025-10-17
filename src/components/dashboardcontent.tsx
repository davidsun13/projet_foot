import React from 'react';
import Card from './card';
import ballon from '../assets/signe.png';
import calendrier from '../assets/calendrier.png';
import money from '../assets/sac-dargent.png';
import stats from '../assets/statistiques.png';
function DashboardContent() {
  const handleEdit = (data?: any) => console.log('edit', data);
  const handleDelete = (id?: string | number) => console.log('delete', id);

  return (
    <main className="flex-1 p-6 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
          <Card
            icon={calendrier}
            title="Prochain entraînement"
            subtitle="20 oct. 2025 — 18:30"
            fields={[
              { label: 'Équipe', value: 'Seniors' },
              { label: 'Type', value: 'Technique' },
            ]}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <Card
            icon={ballon}
            title="Prochain match"
            subtitle="25 oct. 2025 — 15:00"
            fields={[
              { label: 'Adversaire', value: 'AS Rivale' },
              { label: 'Lieu', value: 'Stade Municipal' },
            ]}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <Card
            icon={money}
            title="Cotisations"
            subtitle="Statut général"
            fields={[
              { label: 'Payées', value: '120' },
              { label: 'En retard', value: '5' },
            ]}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <Card
            icon={stats}
            title="Stats rapides"
            subtitle="Résumé"
            fields={[
              { label: 'Buts', value: '34' },
              { label: 'Passes', value: '21' },
            ]}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </main>
  );
}

export default DashboardContent;
