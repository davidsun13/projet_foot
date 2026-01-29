import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Player = {
  id_player?: number;
  name?: string;
  surname?: string;
  position?: string;
  team_name?: string;
  number?: number;
  status?: string;
};

type MeResponse = {
  userType: "player" | "coach";
  user: {
    id_player?: number;
    id_coach?: number;
    name: string;
    surname: string;
  };
};

const ListeJoueurs = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<MeResponse | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:1234/me", {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (!res.ok) return;
        const data: MeResponse = await res.json();
        setCurrentUser(data);
      } catch {
        console.log("Utilisateur non connecté");
      }
    }

    fetchUser();
  }, []);

  // 🔹 Récupérer les joueurs
  async function fetchPlayers() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:1234/players", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Impossible de charger les joueurs");
      }

      const data = await res.json();
      setPlayers(Array.isArray(data) ? data : data.players || data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlayers();
  }, []);


  return (
    <div className="w-full max-w-5xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-[Arsenal] font-bold">Joueurs</h2>
      </div>

      <div className="mb-4 flex items-center justify-between">
        {loading && <span>Chargement...</span>}
        {error && <span className="text-red-600">{error}</span>}
      </div>

      <table className="w-full border-collapse bg-white shadow-md rounded text-gray-700">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Nom</th>
            <th className="p-3 text-left">Prénom</th>
            <th className="p-3 text-left">Position</th>
            <th className="p-3 text-left">Équipe</th>
            <th className="p-3 text-left">N°</th>
            <th className="p-3 text-left">Statut</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {players.length === 0 && !loading ? (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-600">
                Aucun joueur enregistré.
              </td>
            </tr>
          ) : (
            players.map((p) => (
              <tr key={p.id_player} className="border-b">
                <td className="p-3">{p.name ?? "-"}</td>
                <td className="p-3">{p.surname ?? "-"}</td>
                <td className="p-3">{p.position ?? "-"}</td>
                <td className="p-3">{p.team_name ?? "-"}</td>
                <td className="p-3">{p.number ?? "-"}</td>
                <td className="p-3">{p.status ?? "-"}</td>
                <td className="p-3 flex gap-2">
                  <Link
                    to={`/joueurs/${p.id_player}`}
                    className="px-2 py-1 bg-blue-200 rounded hover:bg-blue-300"
                  >
                    Voir
                  </Link>

                  {currentUser?.userType === "coach" && (
                    <button>
                      Supprimer
                    </button>
                  )}
                  <button className="px-2 py-1 bg-green-200 rounded hover:bg-green-300">
                      <Link to={`/joueurs/modifier/${p.id_player}`}>Modifier</Link>
                    </button> 
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListeJoueurs;
