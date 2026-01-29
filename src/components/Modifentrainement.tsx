import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

type Team = {
  id_team: number;
  name: string;
};

type Training = {
  id_training?: number;
  date?: string;
  hour?: string;
  type?: string;
  location?: string;
  id_team?: number;
  id_coach?: number | null;
};

const ModifEntrainement = () => {
  const { id_training } = useParams<{ id_training: string }>();
  const navigate = useNavigate();

  const [training, setTraining] = useState<Training>({});
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Charger l'entraînement
  useEffect(() => {
    if (!id_training) return;

    const fetchTraining = async () => {
      try {
        const res = await fetch(`http://localhost:1234/trainings/${id_training}`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
          },
        });
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data: Training = await res.json();
        setTraining(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchTraining();
  }, [id_training]);

  // 🔹 Charger les équipes
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch("http://localhost:1234/teams", {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
          },
        });
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data: Team[] = await res.json();
        setTeams(data);
      } catch (err) {
        console.error("Impossible de charger les équipes :", err);
      }
    };
    fetchTeams();
  }, []);

  // 🔹 Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id_training) return;

    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...training,
        id_training: Number(id_training),
        id_team: training.id_team ? Number(training.id_team) : null,
        id_coach: 1,
      };

      const res = await fetch(`http://localhost:1234/training/${id_training}/modify`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || `Erreur ${res.status}`);
      }

      navigate("/entrainements");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-[Arsenal] font-bold mb-4">Modifier l'entraînement</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-[Arsenal]">Date</label>
          <input
            type="date"
            value={training.date || ""}
            onChange={(e) => setTraining({ ...training, date: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-[Arsenal]">Heure</label>
          <input
            type="time"
            value={training.hour || ""}
            onChange={(e) => setTraining({ ...training, hour: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-[Arsenal]">Lieu</label>
          <input
            type="text"
            value={training.location || ""}
            onChange={(e) => setTraining({ ...training, location: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-[Arsenal]">Type</label>
          <input
            type="text"
            value={training.type || ""}
            onChange={(e) => setTraining({ ...training, type: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-[Arsenal]">Équipe</label>
          <select
            value={training.id_team ?? ""}
            onChange={(e) =>
              setTraining({ ...training, id_team: e.target.value ? Number(e.target.value) : null })
            }
            className="w-full border p-2 rounded"
            required
          >
            <option value="">— Sélectionner une équipe —</option>
            {teams.map((team) => (
              <option key={team.id_team} value={team.id_team}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-black px-4 py-2 rounded hover:bg-red-700"
          >
            {loading ? "Modification..." : "Enregistrer"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/entrainements")}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModifEntrainement;
