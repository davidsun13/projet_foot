import React, { useState } from 'react';

type FormState = {
  date: string;
  time: string;
  equipe: string;
  type: string;
};

export default function CreationEntrainement() {
  const [form, setForm] = useState<FormState>({
    date: '',
    time: '',
    equipe: '',
    type: 'Technique',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
    setError(null);
    setSuccess(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.date || !form.time || !form.equipe || !form.type) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow w-full">
      <h2 className="text-xl font-[Arsenal]-bold mb-4">Créer un entraînement</h2>

      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      {success && <div className="mb-4 text-sm text-green-600">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-[Arsenal] text-gray-700">Date d'entraînement</label>
            <input
              id="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-[Arsenal] text-gray-700">Heure</label>
            <input
              id="time"
              type="time"
              value={form.time}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="equipe" className="block text-sm font-[Arsenal] text-gray-700">Équipe</label>
          <select
            id="equipe"
            value={form.equipe}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-red-500 focus:border-red-500"
          >
            <option value="">Sélectionner une équipe</option>
            <option value="U10">U10</option>
            <option value="U12">U12</option>
            <option value="U14">U14</option>
            <option value="Seniors">Seniors</option>
            <option value="Réserve">Réserve</option>
          </select>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-[Arsenal] text-gray-700">Type d'entraînement</label>
          <select
            id="type"
            value={form.type}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-red-500 focus:border-red-500"
          >
            <option value="Technique">Technique</option>
            <option value="Tactique">Tactique</option>
            <option value="Physique">Physique</option>
            <option value="Révision">Révision</option>
            <option value="Match">Match</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-red-600 text-black px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Créer l'entraînement
          </button>
        </div>
      </form>
    </div>
  );
}