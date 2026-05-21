import React, { useState } from 'react';
import { useMatches } from '../../../application/hooks';
import { Card, Button } from '../../shared';
import type { Match } from '../../../domain/models';

export function CreateMatch() {
  const { createMatch, loading, error } = useMatches();
  const [formData, setFormData] = useState({
    date: '',
    hour: '',
    opponent: '',
    location: 'Home' as const,
    type: 'Championship' as const,
    id_team: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMatch({
        ...formData,
        score_home: 0,
        score_outside: 0,
      });
      setFormData({
        date: '',
        hour: '',
        opponent: '',
        location: 'Home',
        type: 'Championship',
        id_team: 1,
      });
    } catch (err) {
      console.error('Failed to create match:', err);
    }
  };

  return (
    <Card title="Créer un Match">
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
          <label className="block text-sm font-medium mb-1">Adversaire</label>
          <input
            type="text"
            value={formData.opponent}
            onChange={e => setFormData({ ...formData, opponent: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Lieu</label>
          <select
            value={formData.location}
            onChange={e => setFormData({ ...formData, location: e.target.value as any })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="Home">Domicile</option>
            <option value="Outside">Extérieur</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value as any })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="Championship">Championnat</option>
            <option value="Friendly">Amical</option>
            <option value="Cup">Coupe</option>
          </select>
        </div>

        <Button type="submit" isLoading={loading} className="w-full">
          Créer le match
        </Button>
      </form>
    </Card>
  );
}
