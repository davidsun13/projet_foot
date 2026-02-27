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

  if (loading) return <div>Chargement du profil…</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!player) return null;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-[Arsenal] font-bold mb-4">
        Profil du joueur
      </h2>

      <div className="space-y-2 text-gray-700">
        <p>
          <strong>Nom :</strong> {player.surname}
        </p>
        <p>
          <strong>Prénom :</strong> {player.name}
        </p>

        {player.team_name && (
          <p>
            <strong>Équipe :</strong> {player.team_name}
          </p>
        )}

        {player.position && (
          <p>
            <strong>Poste :</strong> {player.position}
          </p>
        )}

        {player.number !== undefined && (
          <p>
            <strong>Numéro :</strong> {player.number}
          </p>
        )}

        {player.status && (
          <p>
            <strong>Statut :</strong> {player.status}
          </p>
        )}

        {player.mail && (
          <p>
            <strong>Email :</strong> {player.mail}
          </p>
        )}

        {player.phone && (
          <p>
            <strong>Téléphone :</strong> {player.phone}
          </p>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Retour
        </button>
      </div>
    </div>
  );
};

export default ProfilePlayer;
