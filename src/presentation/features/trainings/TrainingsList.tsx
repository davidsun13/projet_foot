import React, { useEffect } from 'react';
import { useTrainings } from '../../../application/hooks';
import { Card, Button } from '../../shared';

export function TrainingsList() {
  const { trainings, loading, error, fetchTrainings } = useTrainings();

  useEffect(() => {
    fetchTrainings();
  }, [fetchTrainings]);

  if (loading) return <div className="p-4">Chargement...</div>;
  if (error) return <div className="p-4 text-red-600">Erreur: {error}</div>;

  return (
    <Card title="Liste des Entraînements">
      <div className="space-y-4">
        {trainings.map(training => (
          <div key={training.id_training} className="border rounded p-4">
            <h3 className="font-bold">{training.type}</h3>
            <p className="text-sm text-gray-600">
              {training.date} à {training.hour} - {training.location}
            </p>
            {training.description && (
              <p className="text-sm mt-2">{training.description}</p>
            )}
          </div>
        ))}
        {trainings.length === 0 && <p>Aucun entraînement trouvé.</p>}
      </div>
    </Card>
  );
}
