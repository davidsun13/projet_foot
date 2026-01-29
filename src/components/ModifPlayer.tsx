import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type PlayerUpdate = {
  surname?: string;
  name?: string;
  position?: string;
  number?: number;
  status?: string;
  id_team?: number | null;
};

type Team = {
  id_team: number;
  name: string;
};

const ModifPlayer = () => {
  const { id_player } = useParams();
  const navigate = useNavigate();

  const [player, setPlayer] = useState<PlayerUpdate>({});
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Charger le joueur
  useEffect(() => {
    async function fetchPlayer() {
      try {
        const res = await fetch(`http://localhost:1234/players/${id_player}`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data = await res.json();
        setPlayer(data);
      } catch (err) {
        setError(
          (err as Error).message ||
          "Impossible de se connecter au serveur. Vérifie le back et le CORS."
        );
      }
    }
    fetchPlayer();
  }, [id_player]);

  // 🔹 Charger les équipes
  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await fetch("http://localhost:1234/teams", {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
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

  // 🔹 Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:1234/players/${id_player}/modify`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            id_player: Number(id_player),
            ...player,
          }),
        }
      );

      if (!res.ok) {
        // 204 No Content = ok, sinon on lance erreur
        throw new Error(`Erreur ${res.status}`);
      }

      navigate("/players");
    } catch (err) {
      setError(
        (err as Error).message ||
        "Impossible de se connecter au serveur. Vérifie le back et le CORS."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-[Arsenal] font-bold mb-4">
        Modifier le joueur
      </h2>

      {error && (
        <p className="text-red-600 mb-3 break-words">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nom"
          value={player.surname || ""}
          onChange={(e) => setPlayer({ ...player, surname: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Prénom"
          value={player.name || ""}
          onChange={(e) => setPlayer({ ...player, name: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Position"
          value={player.position || ""}
          onChange={(e) => setPlayer({ ...player, position: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Numéro"
          value={player.number ?? ""}
          onChange={(e) =>
            setPlayer({ ...player, number: Number(e.target.value) })
          }
          className="w-full border p-2 rounded"
        />
        <select
          value={player.status || ""}
          onChange={(e) => setPlayer({ ...player, status: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="">— Status —</option>
          <option value="Actif">Actif</option>
          <option value="Blessé">Blessé</option>
          <option value="Suspendu">Suspendu</option>
          <option value="Absent">Absent</option>
        </select>
        <select
          value={player.id_team ?? ""}
          onChange={(e) =>
            setPlayer({
              ...player,
              id_team: e.target.value ? Number(e.target.value) : null,
            })
          }
          className="w-full border p-2 rounded"
        >
          <option value="">— Sans équipe —</option>
          {teams.map((team) => (
            <option key={team.id_team} value={team.id_team}>
              {team.name}
            </option>
          ))}
        </select>

        <div className="flex justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-gray px-4 py-2 rounded hover:bg-red-700"
          >
            {loading ? "Modification..." : "Enregistrer"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/players")}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModifPlayer;
