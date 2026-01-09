import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Training = {
  id_training?: number;
  date?: string;
  hour?: string;
  type?: string;
  location?: string;
  team?: string;
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

  async function fetchTrainings() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:1234/trainings", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(
          err?.error || "Impossible de charger les entraînements",
        );
      }

      const data = await res.json();
      setTrainings(Array.isArray(data) ? data : data.trainings || data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTrainings();
  }, []);

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm("Confirmer la suppression de cet entraînement ?")) return;

    try {
      const res = await fetch(`http://localhost:1234/deletetraining/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Erreur lors de la suppression");
      }
      fetchTrainings();
    } catch (err) {
      alert("Erreur: " + (err as Error).message);
    }
  }

  async function handleModify(t: Training) {
    if (!t.id_training) return;
    const date = prompt("Date (YYYY-MM-DD)", t.date ?? "");
    if (date === null) return;
    const hour = prompt("Heure (HH:MM)", t.hour ?? "");
    if (hour === null) return;
    const location = prompt("Lieu", t.location ?? "");
    if (location === null) return;
    const team = prompt("Équipe", t.team ?? "");
    if (team === null) return;
    const type = prompt("Type", t.type ?? "");
    if (type === null) return;

    try {
      const res = await fetch("http://localhost:1234/modifytraining", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
        body: JSON.stringify({
          id_training: t.id_training,
          date,
          hour,
          location,
          team,
          type,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la modification");
      }
      fetchTrainings();
    } catch (err) {
      alert("Erreur: " + (err as Error).message);
    }
  }

  return (
    <div className="w-full max-w-5xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-[Arsenal] font-bold">Entraînements</h2>
        {currentUser?.userType === "coach" && (
          <Link
            to="/entrainements/creer"
            className="bg-white text-red-600 px-4 py-2 rounded hover:bg-red-600 hover:text-white font-[Arsenal]"
          >
            + Créer un entraînement
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
            <th className="p-3 text-left">Lieu</th>
            <th className="p-3 text-left">Équipe</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {trainings.length === 0 && !loading ? (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-600">
                Aucune session d'entraînement.
              </td>
            </tr>
          ) : (
            trainings.map((t) => (
              <tr key={t.id_training} className="border-b">
                <td className="p-3">
                  {t.date ? new Date(t.date).toLocaleDateString("fr-FR") : "-"}
                </td>
                <td className="p-3">{t.hour ?? "-"}</td>
                <td className="p-3">{t.location ?? "-"}</td>
                <td className="p-3">{t.name ?? "-"}</td>
                <td className="p-3">{t.type ?? "-"}</td>
                <td className="p-3 flex gap-2">
                  {currentUser?.userType === "coach" && (
                    <>
                      <button
                        onClick={() => handleModify(t)}
                        className="px-2 py-1 bg-yellow-200 rounded hover:bg-yellow-300"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(t.id_training)}
                        className="px-2 py-1 bg-red-200 text-red-800 rounded hover:bg-red-300"
                      >
                        Supprimer
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListeEntrainements;
