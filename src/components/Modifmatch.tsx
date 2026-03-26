import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

type Team = {
  id_team: number;
  name: string;
};

type Match = {
  id_match?: number;
  date?: string;
  hour?: string;
  opponent?: string;
  location?: string;
  type?: string;
  name?: string;
  score_home?: number;
  score_outside?: number;
};

const ModifMatch = () => {
  const { id_match } = useParams<{ id_match: string }>();
  const navigate = useNavigate();

  const [match, setMatch] = useState<Match>({});
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Charger le match
  useEffect(() => {
    if (!id_match) return;

    const fetchMatch = async () => {
      try {
        const res = await fetch(`http://localhost:1234/matchs/${id_match}`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
          },
        });
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data: Match = await res.json();
        setMatch(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchMatch();
  }, [id_match]);

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
    if (!id_match) return;

    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...match,
        id_match: Number(id_match),
        id_team: match.id_team ? Number(match.id_team) : null,
        id_coach: 1,
      };

      const res = await fetch(`http://localhost:1234/matchs/${id_match}/modify`, {
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

      navigate("/matchs");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-[Arsenal] font-bold mb-4">Modifier le match</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-[Arsenal]">Date</label>
          <input
            type="date"
            value={match.date || ""}
            onChange={(e) => setMatch({ ...match, date: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-[Arsenal]">Heure</label>
          <input
            type="time"
            value={match.hour || ""}
            onChange={(e) => setMatch({ ...match, hour: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-[Arsenal]">Lieu</label>
          <input
            type="text"
            value={match.location || ""}
            onChange={(e) => setMatch({ ...match, location: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-[Arsenal]">Adversaire</label>
          <input
            type="text"
            value={match.opponent || ""}
            onChange={(e) => setMatch({ ...match, opponent: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 font-[Arsenal]">Type</label>
          <input
            type="text"
            value={match.type || ""}
            onChange={(e) => setMatch({ ...match, type: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-[Arsenal]">Équipe</label>
          <select
            value={match.id_team ?? ""}
            onChange={(e) =>
              setMatch({ ...match, id_team: e.target.value ? Number(e.target.value) : null })
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
            onClick={() => navigate("/matchs")}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModifMatch;
