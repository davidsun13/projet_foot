import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

type Match = {
  id_match: number;
  date: string;
  hour: string;
  opponent: string;
  location: string;
  type: string;
  name: string;
  score_home: number;
  score_outside: number;
};

type Convocation = {
  id_convocation: number;
  id_player: number;
  id_match: number;
  status: string | null;
  player_name: string;
  player_surname: string;
};

type PlayerStats = {
  id_player: number;
  goals: number;
  passes: number;
  yellow_cards: number;
  red_cards: number;
  minutes_played: number;
};

const ClotureMatch = () => {
  const { id_match } = useParams<{ id_match: string }>();
  const navigate = useNavigate();

  const [match, setMatch] = useState<Match | null>(null);
  const [scoreHome, setScoreHome] = useState<number>(0);
  const [scoreOutside, setScoreOutside] = useState<number>(0);
  const [convocations, setConvocations] = useState<Convocation[]>([]);
  const [playerStats, setPlayerStats] = useState<Map<number, PlayerStats>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch match details
  useEffect(() => {
    if (!id_match) return;

    const fetchMatch = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`http://localhost:1234/matchs/${id_match}`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
          },
        });

        if (!res.ok) throw new Error("Erreur chargement match");

        const data = await res.json();
        setMatch(data);
        setScoreHome(data.score_home || 0);
        setScoreOutside(data.score_outside || 0);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [id_match]);

  // Fetch convocations
  useEffect(() => {
    if (!id_match) return;

    const fetchConvocations = async () => {
      try {
        const res = await fetch(
          `http://localhost:1234/convocationsmatch/coach/${id_match}`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
            },
          }
        );

        if (!res.ok) throw new Error("Erreur chargement convocations");

        const data = await res.json();
        const called = data.filter((c: Convocation) => c.status === "Called");
        setConvocations(called);

        // Initialize player stats map
        const statsMap = new Map<number, PlayerStats>();
        called.forEach((c: Convocation) => {
          statsMap.set(c.id_player, {
            id_player: c.id_player,
            goals: 0,
            passes: 0,
            yellow_cards: 0,
            red_cards: 0,
            minutes_played: 0,
          });
        });
        setPlayerStats(statsMap);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchConvocations();
  }, [id_match]);

  const updatePlayerStat = (
    id_player: number,
    field: keyof PlayerStats,
    value: number
  ) => {
    const newStats = new Map(playerStats);
    const playerStat = newStats.get(id_player) || {
      id_player,
      goals: 0,
      passes: 0,
      yellow_cards: 0,
      red_cards: 0,
      minutes_played: 0,
    };
    playerStat[field] = value;
    newStats.set(id_player, playerStat);
    setPlayerStats(newStats);
  };

  const handleSave = async () => {
    if (!match) return;

    setSaving(true);
    try {
      // Update score
      const scoreRes = await fetch(
        `http://localhost:1234/matchs/${match.id_match}/score`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
          },
          credentials: "include",
          body: JSON.stringify({
            score_home: scoreHome,
            score_outside: scoreOutside,
          }),
        }
      );

      if (!scoreRes.ok) throw new Error("Erreur mise à jour score");

      // Save statistics for each player
      for (const [, stats] of playerStats) {
        const statsRes = await fetch(
          `http://localhost:1234/statistics`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
            },
            credentials: "include",
            body: JSON.stringify({
              id_player: stats.id_player,
              id_match: match.id_match,
              goals: stats.goals,
              passes: stats.passes,
              yellow_cards: stats.yellow_cards,
              red_cards: stats.red_cards,
              minutes_played: stats.minutes_played,
            }),
          }
        );

        if (!statsRes.ok) {
          throw new Error(`Erreur sauvegarde stats joueur ${stats.id_player}`);
        }
      }

      alert("Match clôturé avec succès !");
      navigate("/matchs");
    } catch (err) {
      setError((err as Error).message);
      alert("Erreur lors de la sauvegarde : " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-600">Erreur : {error}</div>;
  if (!match) return <div className="p-6">Match non trouvé</div>;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-[Arsenal]">Clôturer le match</h1>
        <button
          onClick={() => navigate("/matchs")}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Retour
        </button>
      </div>

      {/* MATCH DETAILS */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-2xl font-bold font-[Arsenal]">
          {match.opponent}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Date</span>
            <p className="font-semibold">
              {new Date(match.date).toLocaleDateString("fr-FR")}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Heure</span>
            <p className="font-semibold">{match.hour}</p>
          </div>
          <div>
            <span className="text-gray-600">Lieu</span>
            <p className="font-semibold">{match.location}</p>
          </div>
          <div>
            <span className="text-gray-600">Type</span>
            <p className="font-semibold">{match.type}</p>
          </div>
        </div>
      </div>

      {/* SCORE SECTION */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-xl font-bold font-[Arsenal]">Score du match</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Notre équipe
            </label>
            <input
              type="number"
              min="0"
              value={scoreHome}
              onChange={(e) => setScoreHome(Number(e.target.value))}
              className="w-full p-3 border rounded text-2xl font-bold text-center"
            />
          </div>
          <div className="flex items-end justify-center pb-3">
            <span className="text-4xl font-bold">-</span>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">
              {match.opponent}
            </label>
            <input
              type="number"
              min="0"
              value={scoreOutside}
              onChange={(e) => setScoreOutside(Number(e.target.value))}
              className="w-full p-3 border rounded text-2xl font-bold text-center"
            />
          </div>
        </div>
      </div>

      {/* PLAYER STATISTICS SECTION */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-xl font-bold font-[Arsenal]">
          Statistiques des joueurs
        </h3>

        {convocations.length === 0 ? (
          <p className="text-gray-600">Aucun joueur convoqué</p>
        ) : (
          <div className="space-y-6">
            {convocations.map((convocation) => {
              const stats = playerStats.get(convocation.id_player) || {
                id_player: convocation.id_player,
                goals: 0,
                passes: 0,
                yellow_cards: 0,
                red_cards: 0,
                minutes_played: 0,
              };

              return (
                <div
                  key={convocation.id_player}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <div className="font-semibold text-lg">
                    {convocation.player_surname} {convocation.player_name}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Buts
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={stats.goals}
                        onChange={(e) =>
                          updatePlayerStat(
                            convocation.id_player,
                            "goals",
                            Number(e.target.value)
                          )
                        }
                        className="w-full p-2 border rounded text-center"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Passes
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={stats.passes}
                        onChange={(e) =>
                          updatePlayerStat(
                            convocation.id_player,
                            "passes",
                            Number(e.target.value)
                          )
                        }
                        className="w-full p-2 border rounded text-center"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Cartons jaunes
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={stats.yellow_cards}
                        onChange={(e) =>
                          updatePlayerStat(
                            convocation.id_player,
                            "yellow_cards",
                            Number(e.target.value)
                          )
                        }
                        className="w-full p-2 border rounded text-center"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Cartons rouges
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={stats.red_cards}
                        onChange={(e) =>
                          updatePlayerStat(
                            convocation.id_player,
                            "red_cards",
                            Number(e.target.value)
                          )
                        }
                        className="w-full p-2 border rounded text-center"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Minutes jouées
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="90"
                        value={stats.minutes_played}
                        onChange={(e) =>
                          updatePlayerStat(
                            convocation.id_player,
                            "minutes_played",
                            Number(e.target.value)
                          )
                        }
                        className="w-full p-2 border rounded text-center"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4 justify-end">
        <button
          onClick={() => navigate("/matchs")}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Annuler
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {saving ? "Sauvegarde..." : "Clôturer le match"}
        </button>
      </div>
    </div>
  );
};

export default ClotureMatch;
