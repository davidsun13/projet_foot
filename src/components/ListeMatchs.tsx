import React,{ useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Match = {
  id_match?: number;
  date?: string;
  hour?: string;
  opponent?: string;
  location?: string;
  type?: string;
  team?: string;
  score_home?: number;
  score_outside?: number;
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

const ListeMatchs = () => {
  const [matchs, setMatchs] = useState<Match[]>([]);
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
      } catch (err) {
        console.log("Not logged in");
      }
    }
    fetchUser();
  }, []);

  async function fetchMatchs() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:1234/matchs", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Impossible de charger les matchs");
      }

      const data = await res.json();
      console.log("MATCHS API RESPONSE:", data);
      setMatchs(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMatchs();
  }, []);
  return (
    <div className="w-full max-w-5xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-[Arsenal] font-bold">Matchs</h2>
        {currentUser?.userType === "coach" && (
          <Link
            to="/matchs/creer"
            className="bg-white text-red-600 px-4 py-2 rounded hover:bg-red-600 hover:text-white font-[Arsenal]"
          >
            + Créer un match
          </Link>
        )}
      </div>
      <div className="mb-4 flex items-center justify-between">
        {loading && <span>Chargement...</span>}
        {error && <span className="text-red-600">{error}</span>}
      </div>
      <table className="w-full border-collapse bg-white shadow-md rounded text-gray-700">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Heure</th>
            <th className="p-3 text-left">Adversaire</th>
            <th className="p-3 text-left">Lieu</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Equipe</th>
          </tr>
        </thead>

        <tbody>
          {matchs.map((m) => (
            <tr key={m.id_match} className="border-t hover:bg-gray-100">
              <td className="p-3">{m.date ? new Date(m.date).toLocaleDateString("fr-FR") : "-"}</td>
              <td className="p-3">{m.hour}</td>
              <td className="p-3">{m.opponent}</td>
              <td className="p-3">{m.location}</td>
              <td className="p-3">{m.type}</td>
              <td className="p-3">{m.team}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListeMatchs;
