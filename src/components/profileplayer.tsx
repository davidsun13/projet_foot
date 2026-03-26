import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

type PlayerProfile = {
  id_player: number;
  name: string;
  surname: string;
  mail?: string;
  phone?: string;
  position?: string;
  number?: number;
  status?: string;
  team_name?: string;
};

const ProfilePlayer = () => {
  const { id_player } = useParams();
  const navigate = useNavigate();

  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id_player) return;

    async function fetchPlayerProfile() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `http://localhost:1234/player-profile/${id_player}`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.error || `Erreur ${res.status}`);
        }

        const data = await res.json();
        setPlayer(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayerProfile();
  }, [id_player]);

  if (loading) return <div className="p-4 text-center">Chargement…</div>;
  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;
  if (!player) return null;

  return (
    <div className="w-full px-4 py-6 flex justify-center">
      <div className="w-full max-w-md md:max-w-2xl bg-white rounded-xl shadow-lg p-5 md:p-8">
        
        {/* HEADER */}
        <div className="flex flex-col items-center md:flex-row md:justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold font-[Arsenal] text-center md:text-left">
            Profil du joueur
          </h2>

          <button
            onClick={() => navigate(-1)}
            className="mt-3 md:mt-0 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            Retour
          </button>
        </div>

        {/* INFOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm md:text-base">
          
          <div className="bg-gray-50 p-3 rounded">
            <span className="font-semibold">Nom :</span>
            <p>{player.surname}</p>
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <span className="font-semibold">Prénom :</span>
            <p>{player.name}</p>
          </div>

          {player.team_name && (
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-semibold">Équipe :</span>
              <p>{player.team_name}</p>
            </div>
          )}

          {player.position && (
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-semibold">Poste :</span>
              <p>{player.position}</p>
            </div>
          )}

          {player.number !== undefined && (
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-semibold">Numéro :</span>
              <p>{player.number}</p>
            </div>
          )}

          {player.status && (
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-semibold">Statut :</span>
              <p>{player.status}</p>
            </div>
          )}

          {player.mail && (
            <div className="bg-gray-50 p-3 rounded sm:col-span-2">
              <span className="font-semibold">Email :</span>
              <p className="break-all">{player.mail}</p>
            </div>
          )}

          {player.phone && (
            <div className="bg-gray-50 p-3 rounded sm:col-span-2">
              <span className="font-semibold">Téléphone :</span>
              <p>{player.phone}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePlayer;
