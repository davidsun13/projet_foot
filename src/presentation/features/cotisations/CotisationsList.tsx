import React, { useEffect } from 'react';
import { useCotisations } from '../../../application/hooks';
import { Card } from '../../shared';

export function CotisationsList({ id_player }: { id_player?: number }) {
  const { cotisations, loading, error, fetchCotisations } = useCotisations();

  useEffect(() => {
    fetchCotisations(id_player);
  }, [fetchCotisations, id_player]);

  if (loading) return <div className="p-4">Chargement...</div>;
  if (error) return <div className="p-4 text-red-600">Erreur: {error}</div>;

  const paid = cotisations.filter(c => c.status === 'Paid').length;
  const pending = cotisations.filter(c => c.status === 'Pending').length;
  const overdue = cotisations.filter(c => c.status === 'Overdue').length;

  return (
    <Card title="Mes Cotisations">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded">
          <p className="text-sm text-gray-600">Payées</p>
          <p className="text-2xl font-bold">{paid}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <p className="text-sm text-gray-600">En attente</p>
          <p className="text-2xl font-bold">{pending}</p>
        </div>
        <div className="bg-red-100 p-4 rounded">
          <p className="text-sm text-gray-600">En retard</p>
          <p className="text-2xl font-bold">{overdue}</p>
        </div>
      </div>

      <div className="space-y-3">
        {cotisations.map(cotisation => (
          <div key={cotisation.id_cotisation} className="border rounded p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{cotisation.amount}€</p>
              <p className="text-sm text-gray-600">
                {cotisation.date_payment ? `Payée le ${cotisation.date_payment}` : 'Non payée'}
              </p>
            </div>
            <span className={`px-3 py-1 rounded text-sm font-semibold ${
              cotisation.status === 'Paid' ? 'bg-green-200 text-green-800' :
              cotisation.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' :
              'bg-red-200 text-red-800'
            }`}>
              {cotisation.status === 'Paid' ? 'Payée' : cotisation.status === 'Pending' ? 'En attente' : 'En retard'}
            </span>
          </div>
        ))}
        {cotisations.length === 0 && <p>Aucune cotisation trouvée.</p>}
      </div>
    </Card>
  );
}
