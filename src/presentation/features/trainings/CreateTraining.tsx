import React, { useState } from 'react';
import { useTrainings } from '../../../application/hooks';
import { Card, Button } from '../../shared';

export function CreateTraining() {
  const { createTraining, loading, error } = useTrainings();
  const [formData, setFormData] = useState({
    date: '',
    hour: '',
    location: '',
    type: '',
    description: '',
    id_team: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTraining(formData);
      setFormData({
        date: '',
        hour: '',
        location: '',
        type: '',
        description: '',
        id_team: 1,
      });
    } catch (err) {
      console.error('Failed to create training:', err);
    }
  };

  return (
    <Card title="Créer un Entraînement">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Heure</label>
          <input
            type="time"
            value={formData.hour}
            onChange={e => setFormData({ ...formData, hour: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Lieu</label>
          <input
            type="text"
            value={formData.location}
            onChange={e => setFormData({ ...formData, location: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <input
            type="text"
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description (optionnel)</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full border rounded px-3 py-2"
            rows={3}
          />
        </div>

        <Button type="submit" isLoading={loading} className="w-full">
          Créer l'entraînement
        </Button>
      </form>
    </Card>
  );
}
