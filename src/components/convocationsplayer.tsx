import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type TrainingConvocation = {
  id_training: number;
  date: string;
  hour: string;
  location: string;
  type: string;
  team_name: string;
  status: string;
};

type MatchConvocation = {
  id_match: number;
  date: string;
  hour: string;
  location: string;
  opponent: string;
  team_name: string;
  status: string;
};

type MeResponse = {
  userType: "player" | "coach";
  user: {
    id_player?: number;
    name: string;
    surname: string;
  };
};

const ConvocationsPlayer = () => {
  const [trainings, setTrainings] = useState<TrainingConvocation[]>([]);
  const [matchs, setMatchs] = useState<MatchConvocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<number | null>(null);

  // 🔹 Récupérer le joueur connecté
  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("http://localhost:1234/me", {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (!res.ok) throw new Error("Non authentifié");

        const data: MeResponse = await res.json();
        setPlayerId(data.user.id_player ?? null);
      } catch (err) {
        setError("Impossible de récupérer l'utilisateur");
      }
    }
    fetchMe();
  }, []);

  useEffect(() => {
    if (!playerId) return;

    async function fetchConvocations() {
      try {
        setLoading(true);

        const [trainRes, matchRes] = await Promise.all([
          fetch(`http://localhost:1234/convocationstraining/${playerId}`, {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }),
          fetch(`http://localhost:1234/convocationsmatch/${playerId}`, {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }),
        ]);

        if (!trainRes.ok || !matchRes.ok)
          throw new Error("Erreur lors du chargement des convocations");

        setTrainings(await trainRes.json());
        setMatchs(await matchRes.json());
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchConvocations();
    console.log("Player ID:", playerId);
  }, [playerId]);

  if (loading) return <div>Chargement des convocations...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-10">
      <h1 className="text-2xl font-[Arsenal] font-bold">
        Mes convocations
      </h1>

      {/* 🔹 Entraînements */}
      <section>
        <h2 className="text-xl font-semibold mb-3">🏃‍♂️ Entraînements</h2>

        <table className="w-full bg-white shadow rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Heure</th>
              <th className="p-3 text-left">Lieu</th>
              <th className="p-3 text-left">Équipe</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Statut</th>
            </tr>
          </thead>
          <tbody>
            {trainings.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  Aucune convocation
                </td>
              </tr>
            ) : (
              trainings.map((t) => (
                <tr key={t.id_training} className="border-b">
                  <td className="p-3">
                    {new Date(t.date).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="p-3">{t.hour}</td>
                  <td className="p-3">{t.location}</td>
                  <td className="p-3">{t.team_name}</td>
                  <td className="p-3">{t.type}</td>
                  <td className="p-3 font-semibold">{t.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* 🔹 Matchs */}
      <section>
        <h2 className="text-xl font-semibold mb-3">⚽ Matchs</h2>

        <table className="w-full bg-white shadow rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Heure</th>
              <th className="p-3 text-left">Lieu</th>
              <th className="p-3 text-left">Adversaire</th>
              <th className="p-3 text-left">Équipe</th>
              <th className="p-3 text-left">Statut</th>
            </tr>
          </thead>
          <tbody>
            {matchs.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  Aucune convocation
                </td>
              </tr>
            ) : (
              matchs.map((m) => (
                <tr key={m.id_match} className="border-b">
                  <td className="p-3">
                    {new Date(m.date).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="p-3">{m.hour}</td>
                  <td className="p-3">{m.location}</td>
                  <td className="p-3">{m.opponent}</td>
                  <td className="p-3">{m.team_name}</td>
                  <td className="p-3 font-semibold">{m.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ConvocationsPlayer;
