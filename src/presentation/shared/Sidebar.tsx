import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  userType?: 'player' | 'coach';
}

export function Sidebar({ userType = 'player' }: SidebarProps) {
  const playerLinks = [
    { label: 'Tableau de bord', to: '/dashboard' },
    { label: 'Mes profil', to: '/profile' },
    { label: 'Matchs', to: '/matches' },
    { label: 'Entraînements', to: '/trainings' },
    { label: 'Mes cotisations', to: '/cotisations' },
    { label: 'Convocations', to: '/convocations' },
  ];

  const coachLinks = [
    { label: 'Tableau de bord', to: '/dashboard' },
    { label: 'Joueurs', to: '/players' },
    { label: 'Créer un match', to: '/matches/create' },
    { label: 'Créer un entraînement', to: '/trainings/create' },
    { label: 'Gestion cotisations', to: '/cotisations' },
  ];

  const links = userType === 'coach' ? coachLinks : playerLinks;

  return (
    <aside className="w-64 bg-gray-100 p-4 min-h-screen">
      <nav className="space-y-2">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className="block px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
