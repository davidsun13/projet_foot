import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

type Convocation = {
  id_convocation: number;
  id_player: number;
  id_training: number;
  status: string | null;
  player_name: string;
  player_surname: string;
};

const ConvocationTrainingDetail = () => {
  const { id_training } = useParams();
  const navigate = useNavigate();

  const [convocations, setConvocations] = useState<Convocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id_training) return;

    const fetchConvocations = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `http://localhost:1234/convocationstraining/${id_training}`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
            },
          }
        );

        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.error || "Erreur chargement convocations");
        }

        const data = await res.json();

        // 🔥 Tri automatique : Présent > Incertain > En attente > Absent
        const order = ["Called", "Incertain", "Waiting", "Refused"];

        const sorted = data.sort(
          (a: Convocation, b: Convocation) =>
            order.indexOf(a.status || "") - order.indexOf(b.status || "")
        );

        setConvocations(sorted);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchConvocations();
  }, [id_training]);

  // 🔹 Compteurs dynamiques
  const presentCount = convocations.filter(c => c.status === "Called").length;
  const absentCount = convocations.filter(c => c.status === "Refused").length;
  const unsureCount = convocations.filter(c => c.status === "Incertain").length;
  const pendingCount = convocations.filter(c => !c.status || c.status === "Waiting").length;

  const total = convocations.length;

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "Called":
        return "bg-green-100 text-green-700";
      case "Refused":
        return "bg-red-100 text-red-700";
      case "Incertain":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Convocations - Entraînement #{id_training}
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Retour
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-green-100 p-4 rounded text-center">
          <div className="text-xl font-bold">{presentCount}</div>
          <div>Présents</div>
        </div>
        <div className="bg-red-100 p-4 rounded text-center">
          <div className="text-xl font-bold">{absentCount}</div>
          <div>Absents</div>
        </div>
        <div className="bg-yellow-100 p-4 rounded text-center">
          <div className="text-xl font-bold">{unsureCount}</div>
          <div>Incertain</div>
        </div>
        <div className="bg-gray-100 p-4 rounded text-center">
          <div className="text-xl font-bold">{pendingCount}</div>
          <div>En attente</div>
        </div>
      </div>

      {/* Tableau */}
      <table className="w-full border-collapse bg-white shadow-md rounded text-gray-700">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Joueur</th>
            <th className="p-3 text-left">Statut</th>
          </tr>
        </thead>
        <tbody>
          {total === 0 ? (
            <tr>
              <td colSpan={2} className="p-4 text-center text-gray-500">
                Aucun joueur convoqué.
              </td>
            </tr>
          ) : (
            convocations.map((c) => (
              <tr key={c.id_convocation} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">
                  {c.player_name} {c.player_surname}
                </td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(
                      c.status
                    )}`}
                  >
                    {c.status || "En attente"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Résumé */}
      {total > 0 && (
        <div className="text-sm text-gray-600">
          Total joueurs convoqués : <strong>{total}</strong>
        </div>
      )}
    </div>
  );
};

export default ConvocationTrainingDetail;
