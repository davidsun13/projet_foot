import React from 'react';

interface HeaderProps {
  onLogout?: () => void;
  userType?: 'player' | 'coach';
}

export function Header({ onLogout, userType }: HeaderProps) {
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Club de Football</h1>
        <div className="flex gap-4">
          {userType && <span className="text-sm">{userType === 'coach' ? 'Entraîneur' : 'Joueur'}</span>}
          {onLogout && (
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              Déconnexion
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
