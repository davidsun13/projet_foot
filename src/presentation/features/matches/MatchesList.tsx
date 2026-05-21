import React, { useEffect } from 'react';
import { useMatches } from '../../../application/hooks';
import { Card, Button } from '../../shared';

export function MatchesList() {
  const { matches, loading, error, fetchMatches } = useMatches();

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  if (loading) return <div className="p-4">Chargement...</div>;
  if (error) return <div className="p-4 text-red-600">Erreur: {error}</div>;

  return (
    <Card title="Liste des Matchs">
      <div className="space-y-4">
        {matches.map(match => (
          <div key={match.id_match} className="border rounded p-4">
            <h3 className="font-bold">{match.opponent}</h3>
            <p className="text-sm text-gray-600">
              {match.date} à {match.hour} - {match.location === 'Home' ? '🏠 Domicile' : '✈️ Extérieur'}
            </p>
            <p className="text-lg font-semibold mt-2">
              {match.score_home} - {match.score_outside}
            </p>
          </div>
        ))}
        {matches.length === 0 && <p>Aucun match trouvé.</p>}
      </div>
    </Card>
  );
}
