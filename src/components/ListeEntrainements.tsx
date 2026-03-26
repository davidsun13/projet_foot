import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Training = {
  id_training?: number;
  date?: string;
  hour?: string;
  type?: string;
  location?: string;
  team_name?: string;
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

const ListeEntrainements = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [currentUser, setCurrentUser] = useState<MeResponse | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("http://localhost:1234/me", {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!res.ok) return;
      const data = await res.json();
      setCurrentUser(data);
    }

    fetchUser();
  }, []);

  async function fetchTrainings() {
    const res = await fetch("http://localhost:1234/trainings", {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    const data = await res.json();
    setTrainings(data);
  }

  useEffect(() => {
    fetchTrainings();
  }, []);

  async function handleDelete(id?: number) {
    if (!id) return;

    if (!confirm("Confirmer la suppression ?")) return;

    await fetch(`http://localhost:1234/deletetraining/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    fetchTrainings();
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold font-[Arsenal]">Entraînements</h2>

        {currentUser?.userType === "coach" && (
          <Link
            to="/entrainements/creer"
            className="bg-white text-red-600 px-4 py-2 rounded hover:bg-red-600 hover:text-white"
          >
            + Créer un entraînement
          </Link>
        )}
      </div>

      <div className="md:hidden space-y-4">
        {trainings.map((t) => (
          <div
            key={t.id_training}
            className="bg-white shadow rounded-lg p-4 text-left"
          >
            <p className="font-semibold text-lg">
              {t.date
                ? new Date(t.date).toLocaleDateString("fr-FR")
                : "-"}{" "}
              • {t.hour}
            </p>

            <p className="text-gray-600">📍 {t.location}</p>
            <p className="text-gray-600">👥 {t.team_name}</p>
            <p className="text-gray-600">⚽ {t.type}</p>

            {currentUser?.userType === "coach" && (
              <div className="flex flex-wrap gap-2 mt-3">
                <Link
                  to={`/convocations/training/${t.id_training}`}
                  className="px-3 py-1 bg-blue-200 rounded"
                >
                  Détails
                </Link>

                <Link
                  to={`/entrainements/modifier/${t.id_training}`}
                  className="px-3 py-1 bg-green-200 rounded"
                >
                  Modifier
                </Link>

                <button
                  onClick={() => handleDelete(t.id_training)}
                  className="px-3 py-1 bg-red-200 rounded"
                >
                  Supprimer
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full bg-white shadow rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Heure</th>
              <th className="p-3 text-left">Lieu</th>
              <th className="p-3 text-left">Équipe</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {trainings.map((t) => (
              <tr key={t.id_training} className="border-t">
                <td className="p-3">
                  {t.date
                    ? new Date(t.date).toLocaleDateString("fr-FR")
                    : "-"}
                </td>
                <td className="p-3">{t.hour}</td>
                <td className="p-3">{t.location}</td>
                <td className="p-3">{t.team_name}</td>
                <td className="p-3">{t.type}</td>

                <td className="p-3 flex gap-2">
                  {currentUser?.userType === "coach" && (
                    <>
                      <Link
                        to={`/convocations/training/${t.id_training}`}
                        className="px-2 py-1 bg-blue-200 rounded"
                      >
                        Détails
                      </Link>

                      <Link
                        to={`/entrainements/modifier/${t.id_training}`}
                        className="px-2 py-1 bg-green-200 rounded"
                      >
                        Modifier
                      </Link>

                      <button
                        onClick={() => handleDelete(t.id_training)}
                        className="px-2 py-1 bg-red-200 rounded"
                      >
                        Supprimer
                      </button>
                    </>
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

export default ListeEntrainements;
