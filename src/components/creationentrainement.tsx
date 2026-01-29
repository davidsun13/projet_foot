import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Button from './button';

type FormState = {
  date: string;
  time: string;
  equipe: string; // id_team en string
  type: string;
  lieu: string;
  id_coach: number;
};

type Team = {
  id_team: number;
  name: string;
};

export default function CreationEntrainement() {
  const [form, setForm] = useState<FormState>({
    date: '',
    time: '',
    equipe: '',
    type: '',
    lieu: '',
    id_coach: '',
  });

  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  // 🔹 Charger dynamiquement les équipes du coach
  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await fetch("http://localhost:1234/teams", {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
          },
        });

        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data = await res.json();
        setTeams(data);
      } catch (err) {
        console.error("Impossible de charger les équipes:", err);
      }
    }
    fetchTeams();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.date || !form.time || !form.equipe || !form.type || !form.lieu) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    console.log("Envoi du formulaire avec les données :", form);
    try {
      setError(null);
      const res = await fetch("http://localhost:1234/createtraining", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
        body: JSON.stringify({
          date: form.date,
          hour: form.time,
          id_team: Number(form.equipe), // envoyer l'id_team
          type: form.type,
          location: form.lieu,
          id_coach: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de la création");
        return;
      }

      setSuccess("Entraînement créé avec succès.");
      setForm({ date: "", time: "", equipe: "", type: "Technique", lieu: "", id_coach: null });
      navigate("/entrainements");
    } catch (err) {
      setError("Erreur réseau : " + (err as Error).message);
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

        {/* 🔹 Sélection dynamique des équipes */}
        <div>
          <label htmlFor="equipe" className="block text-sm font-[Arsenal] text-gray-700">Équipe</label>
          <select
            id="equipe"
            value={form.equipe}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-red-500 focus:border-red-500"
          >
            <option value="">Sélectionner une équipe</option>
            {teams.map(team => (
              <option key={team.id_team} value={team.id_team}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type d'entraînement */}
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

        {/* Lieu */}
        <div>
          <label htmlFor="lieu" className="block text-sm font-[Arsenal] text-gray-700">Lieu</label>
          <select
            id="lieu"
            value={form.lieu}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-red-500 focus:border-red-500"
          >
            <option value="">Sélectionner un lieu</option>
            <option value="Stade Municipal">Stade Municipal</option>
            <option value="Centre d'Entraînement">Centre d'Entraînement</option>
            <option value="Terrain Annexe">Terrain Annexe</option>
          </select>
        </div>

        <div className="flex justify-end">
          <Button
            size="sm"
            variant="ghost"
            type="submit"
            className="bg-red-600 text-black px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Créer l'entraînement
          </Button>
        </div>
      </form>
    </div>
  );
}
