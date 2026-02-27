import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

type Player = {
  id_player: number;
  name: string;
  surname: string;
  mail?: string;
  phone?: string;
  position?: string;
  number?: number;
  status: string;
  team_name: string;
  goals: number;
  passes: number;
  yellow_cards: number;
  red_cards: number;
};

const DetailsPlayer = () => {
  const { id_player } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id_player) return;

    const fetchPlayer = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `http://localhost:1234/detailsplayer/${id_player}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.error || "Erreur chargement joueur");
        }

        const data = await res.json();
        setPlayer(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id_player]);

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!player) return <div className="p-6">Aucun joueur trouvé.</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            {player.name} {player.surname}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Retour
          </button>
        </div>

        {/* Infos principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">

          <div>
            <p className="text-sm text-gray-500">Poste</p>
            <p className="font-semibold">{player.position || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Numéro</p>
            <p className="font-semibold">{player.number || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold">{player.mail || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Téléphone</p>
            <p className="font-semibold">{player.phone || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Équipe</p>
            <p className="font-semibold">{player.team_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Statut</p>
            <p className="font-semibold">{player.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Buts</p>
            <p className="font-semibold">{player.goals}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Passes</p>
            <p className="font-semibold">{player.passes}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cartons jaunes</p>
            <p className="font-semibold">{player.yellow_cards}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cartons rouges</p>
            <p className="font-semibold">{player.red_cards}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DetailsPlayer;
