import React,{ useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

      } catch {
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
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
      });

      const data = await res.json();

      setMatchs(data);

    } catch (err) {
      setError((err as Error).message);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchMatchs();
  }, []);

  return (

    <div className="w-full max-w-7xl mx-auto px-4">

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

        <h2 className="text-2xl font-bold font-[Arsenal]">
          Matchs
        </h2>

        {currentUser?.userType === "coach" && (
          <Link
            to="/matchs/creer"
            className="bg-white text-red-600 px-4 py-2 rounded hover:bg-red-600 hover:text-white font-[Arsenal] w-fit"
          >
            + Créer un match
          </Link>
        )}

      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="md:hidden flex flex-col gap-4">

        {matchs.map((m) => (

          <div
            key={m.id_match}
            className="bg-white shadow rounded-lg p-4 border"
          >

            <div className="flex justify-between mb-2">

              <span className="font-semibold">
                {m.opponent}
              </span>

              <span className="text-gray-500 text-sm">
                {m.date
                  ? new Date(m.date).toLocaleDateString("fr-FR")
                  : "-"}
              </span>

            </div>

            <div className="text-sm text-gray-600 space-y-1">

              <p>🕒 {m.hour}</p>

              <p>📍 {m.location}</p>

              <p>🏆 {m.type}</p>

              <p>👥 {m.name}</p>

              <p className="font-semibold">
                Score : {m.score_home} - {m.score_outside}
              </p>

            </div>

            <div className="flex gap-2 mt-3">

              <button className="flex-1 bg-blue-500 text-white py-1 rounded hover:bg-blue-600">
                Modifier
              </button>

              <button className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600">
                Voir
              </button>

              {currentUser?.userType === "coach" && (
                <Link
                  to={`/matchs/cloturer/${m.id_match}`}
                  className="flex-1 bg-orange-500 text-white py-1 rounded hover:bg-orange-600 text-center"
                  >
                  Clôturer
                </Link>
              )}

            </div>

          </div>

        ))}

      </div>

      <div className="hidden md:block overflow-x-auto">

        <table className="min-w-full bg-white shadow rounded">

          <thead className="bg-gray-200">

            <tr>

              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Heure</th>
              <th className="p-3 text-left">Adversaire</th>
              <th className="p-3 text-left">Lieu</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Equipe</th>
              <th className="p-3 text-left">Score</th>
              <th className="p-3 text-left">Actions</th>

            </tr>

          </thead>

          <tbody>

            {matchs.map((m) => (

              <tr key={m.id_match} className="border-t hover:bg-gray-50">

                <td className="p-3">
                  {m.date
                    ? new Date(m.date).toLocaleDateString("fr-FR")
                    : "-"}
                </td>

                <td className="p-3">{m.hour}</td>

                <td className="p-3">{m.opponent}</td>

                <td className="p-3">{m.location}</td>

                <td className="p-3">{m.type}</td>

                <td className="p-3">{m.name}</td>

                <td className="p-3">
                  {m.score_home} - {m.score_outside}
                </td>

                <td className="p-3 flex gap-2">

                  <Link
                    to={`/matchs/modifier/${m.id_match}`}
                    className="px-3 py-1 bg-green-200 rounded"
                    >
                    Modifier
                    </Link>

                    <Link
                      to={`/convocations/match/${m.id_match}`}
                      className="px-3 py-1 bg-blue-200 rounded"
                      >
                      Détails
                      </Link>

                    {currentUser?.userType === "coach" && (
                      <Link
                        to={`/matchs/cloturer/${m.id_match}`}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                        Clôturer
                        </Link>
                    )}
                    

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );
};

export default ListeMatchs;
