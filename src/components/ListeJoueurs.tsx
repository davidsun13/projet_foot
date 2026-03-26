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

      const data = await res.json();
      setPlayers(Array.isArray(data) ? data : data.players || data);
    } catch (err) {
      setError((err as Error).message);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl md:text-3xl font-bold font-[Arsenal]">
          Joueurs
        </h2>

      </div>

      {loading && <div>Chargement...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* MOBILE */}

      <div className="md:hidden flex flex-col gap-4">

        {players.length === 0 && !loading && (
          <div className="text-center text-gray-500">
            Aucun joueur enregistré.
          </div>
        )}

        {players.map((p) => (

          <div
            key={p.id_player}
            className="bg-white border shadow rounded-lg p-4 space-y-2"
          >

            <div className="font-semibold text-lg">
              {p.name} {p.surname}
            </div>

            <div className="text-sm text-gray-600">
              Position : {p.position ?? "-"}
            </div>

            <div className="text-sm text-gray-600">
              Équipe : {p.team_name ?? "-"}
            </div>

            <div className="text-sm text-gray-600">
              Numéro : {p.number ?? "-"}
            </div>

            <div className="text-sm text-gray-600">
              Statut : {p.status ?? "-"}
            </div>

            <div className="flex gap-2 pt-2">

              <Link
                to={`/joueurs/${p.id_player}`}
                className="px-3 py-1 bg-blue-200 rounded hover:bg-blue-300"
              >
                Voir
              </Link>

              {currentUser?.userType === "coach" && (
                <button className="px-3 py-1 bg-red-200 rounded hover:bg-red-300">
                  Supprimer
                </button>
              )}

              <Link
                to={`/joueurs/modifier/${p.id_player}`}
                className="px-3 py-1 bg-green-200 rounded hover:bg-green-300"
              >
                Modifier
              </Link>

            </div>

          </div>

        ))}

      </div>

      {/* DESKTOP TABLE */}

      <div className="hidden md:block overflow-x-auto">

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
                <td colSpan={7} className="p-4 text-center text-gray-600">
                  Aucun joueur enregistré.
                </td>
              </tr>

            ) : (

              players.map((p) => (

                <tr key={p.id_player} className="border-b hover:bg-gray-50">

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
                      <button className="px-2 py-1 bg-red-200 rounded hover:bg-red-300">
                        Supprimer
                      </button>
                    )}

                    <Link
                      to={`/joueurs/modifier/${p.id_player}`}
                      className="px-2 py-1 bg-green-200 rounded hover:bg-green-300"
                    >
                      Modifier
                    </Link>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default ListeJoueurs;
