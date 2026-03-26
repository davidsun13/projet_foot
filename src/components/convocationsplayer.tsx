import React, { useEffect, useState } from "react";

type TrainingConvocation = {
  id_convocation: number;
  id_training: number;
  date: string;
  hour: string;
  location: string;
  type: string;
  team_name: string;
  status: string;
};

type MatchConvocation = {
  id_convocation: number;
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

  // 🔹 Récupérer utilisateur
  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("http://localhost:1234/me", {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (!res.ok) throw new Error();

        const data: MeResponse = await res.json();
        setPlayerId(data.user.id_player ?? null);
      } catch {
        setError("Impossible de récupérer l'utilisateur");
      }
    }
    fetchMe();
  }, []);

  // 🔹 Récupérer convocations
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
          throw new Error("Erreur chargement");

        setTrainings(await trainRes.json());
        setMatchs(await matchRes.json());
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchConvocations();
  }, [playerId]);
  const updateStatus = async (id_convocation: number, status: string) => {
  if (!playerId) return;

  try {
    const res = await fetch(
      `http://localhost:1234/convocations/${id_convocation}/status/${playerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!res.ok) throw new Error("Erreur mise à jour");

    // 🔥 Mise à jour locale (UX instant)
    setTrainings((prev) =>
      prev.map((t) =>
        t.id_convocation === id_convocation ? { ...t, status } : t
      )
    );

    setMatchs((prev) =>
      prev.map((m) =>
        m.id_convocation === id_convocation ? { ...m, status } : m
      )
    );
  } catch (err) {
    alert("Erreur : " + (err as Error).message);
  }
};
  const getStatusColor = (status: string) => {
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

  if (loading) return <div className="p-4 text-center">Chargement...</div>;
  if (error) return <div className="p-4 text-red-600 text-center">{error}</div>;

  return (
    <div className="w-full px-4 py-6 space-y-10">
      <h1 className="text-xl md:text-2xl font-bold font-[Arsenal] text-center md:text-left">
        Mes convocations
      </h1>

      {/* ================= TRAININGS ================= */}
      <section>
        <h2 className="text-lg md:text-xl font-semibold mb-4">
          🏃‍♂️ Entraînements
        </h2>

        {/* 📱 MOBILE */}
        <div className="space-y-4 md:hidden">
          {trainings.length === 0 ? (
            <p className="text-gray-500 text-center">Aucune convocation</p>
          ) : (
            trainings.map((t) => (
              <div
                key={t.id_training}
                className="bg-white p-4 rounded-lg shadow space-y-2"
              >
                <p><strong>Date :</strong> {new Date(t.date).toLocaleDateString("fr-FR")}</p>
                <p><strong>Heure :</strong> {t.hour}</p>
                <p><strong>Lieu :</strong> {t.location}</p>
                <p><strong>Équipe :</strong> {t.team_name}</p>
                <p><strong>Type :</strong> {t.type}</p>
                <div className="flex flex-col gap-2 mt-2">
                  <span className={`px-2 py-1 rounded text-sm font-semibold ${getStatusColor(t.status)}`}>
                    {t.status}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(t.id_convocation, "Called")}
                      className="flex-1 bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Présent
                    </button>
                    <button
                      onClick={() => updateStatus(t.id_convocation, "Refused")}
                      className="flex-1 bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Absent
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 💻 TABLET / DESKTOP */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full bg-white shadow rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Heure</th>
                <th className="p-3 text-left">Lieu</th>
                <th className="p-3 text-left">Équipe</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Statut</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainings.map((t) => (
                <tr key={t.id_training} className="border-b hover:bg-gray-50">
                  <td className="p-3">{new Date(t.date).toLocaleDateString("fr-FR")}</td>
                  <td className="p-3">{t.hour}</td>
                  <td className="p-3">{t.location}</td>
                  <td className="p-3">{t.team_name}</td>
                  <td className="p-3">{t.type}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm font-semibold ${getStatusColor(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => updateStatus(t.id_convocation, "Called")}
                      className="px-2 py-1 bg-green-200 rounded hover:bg-green-300"
                    >
                      ✔
                    </button>
                    <button
                      onClick={() => updateStatus(t.id_convocation, "Refused")}
                      className="px-2 py-1 bg-red-200 rounded hover:bg-red-300"
                    >
                      ✖
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ================= MATCHS ================= */}
      <section>
        <h2 className="text-lg md:text-xl font-semibold mb-4">
          ⚽ Matchs
        </h2>

        {/* 📱 MOBILE */}
        <div className="space-y-4 md:hidden">
          {matchs.length === 0 ? (
            <p className="text-gray-500 text-center">Aucune convocation</p>
          ) : (
            matchs.map((m) => (
              <div
                key={m.id_match}
                className="bg-white p-4 rounded-lg shadow space-y-2"
              >
                <p><strong>Date :</strong> {new Date(m.date).toLocaleDateString("fr-FR")}</p>
                <p><strong>Heure :</strong> {m.hour}</p>
                <p><strong>Lieu :</strong> {m.location}</p>
                <p><strong>Adversaire :</strong> {m.opponent}</p>
                <p><strong>Équipe :</strong> {m.team_name}</p>
                <span className={`px-2 py-1 rounded text-sm font-semibold ${getStatusColor(m.status)}`}>
                  {m.status}
                </span>
                <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(m.id_convocation, "Called")}
                      className="flex-1 bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Présent
                    </button>
                    <button
                      onClick={() => updateStatus(m.id_convocation, "Refused")}
                      className="flex-1 bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Absent
                    </button>
                  </div>
              </div>
            ))
          )}
        </div>

        {/* 💻 DESKTOP */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full bg-white shadow rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Heure</th>
                <th className="p-3 text-left">Lieu</th>
                <th className="p-3 text-left">Adversaire</th>
                <th className="p-3 text-left">Équipe</th>
                <th className="p-3 text-left">Statut</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {matchs.map((m) => (
                <tr key={m.id_match} className="border-b hover:bg-gray-50">
                  <td className="p-3">{new Date(m.date).toLocaleDateString("fr-FR")}</td>
                  <td className="p-3">{m.hour}</td>
                  <td className="p-3">{m.location}</td>
                  <td className="p-3">{m.opponent}</td>
                  <td className="p-3">{m.team_name}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm font-semibold ${getStatusColor(m.status)}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => updateStatus(m.id_convocation, "Called")}
                      className="px-2 py-1 bg-green-200 rounded hover:bg-green-300"
                    >
                      ✔
                    </button>
                    <button
                      onClick={() => updateStatus(m.id_convocation, "Refused")}
                      className="px-2 py-1 bg-red-200 rounded hover:bg-red-300"
                    >
                      ✖
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ConvocationsPlayer;
