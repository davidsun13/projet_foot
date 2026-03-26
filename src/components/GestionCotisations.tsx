import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Subscription = {
  id?: number;
  player?: { name?: string; surname?: string };
  name?: string;
  surname?: string;
  total_amount?: number;
  paid_amount?: number;
  remaining_amount?: number;
  status?: string;
  [key: string]: any;
};

export const GestionCotisations = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchSubscriptions() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:1234/subscriptions", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
      });

      const data = await res.json();
      const list: Subscription[] = Array.isArray(data)
        ? data
        : data.subscriptions || [];

      setSubscriptions(list);
    } catch (err) {
      setError((err as Error).message);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Payé":
        return "text-green-600";
      case "Partiel":
        return "text-yellow-600";
      case "Non payé":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">

        <h1 className="text-2xl md:text-3xl font-bold">
          Gestion des cotisations
        </h1>

        <Link
          to="/cotisations/ajouter"
          className="bg-white border border-red-600 text-black px-4 py-2 rounded hover:bg-white hover:text-red-700 text-center"
        >
          Ajouter une cotisation
        </Link>

      </div>

      {/* FILTRES */}

      <div className="flex flex-col md:flex-row gap-4 mb-6">

        <input
          type="text"
          placeholder="Rechercher un joueur..."
          className="border p-2 rounded w-full md:w-1/3"
        />

        <select className="border p-2 rounded w-full md:w-1/4">
          <option>Tous les statuts</option>
          <option>Payé</option>
          <option>Partiel</option>
          <option>Non payé</option>
        </select>

      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* MOBILE */}

      <div className="md:hidden flex flex-col gap-4">

        {subscriptions.length === 0 && !loading && (
          <div className="text-center text-gray-500">
            Aucune cotisation trouvée.
          </div>
        )}

        {subscriptions.map((s, idx) => {
          const playerName =
            (s.player &&
              `${s.player.name || ""} ${s.player.surname || ""}`.trim()) ||
            `${s.name || ""} ${s.surname || ""}`.trim() ||
            `#${s.id ?? idx}`;

          const total = s.total_amount ?? s.total ?? 0;
          const paid = s.paid_amount ?? s.paid ?? 0;
          const remaining =
            s.remaining_amount ?? s.remaining ?? Math.max(0, total - paid);

          const status =
            s.status ??
            (remaining === 0 ? "Payé" : paid === 0 ? "Non payé" : "Partiel");

          return (
            <div
              key={s.id ?? idx}
              className="bg-white border shadow rounded-lg p-4 space-y-2"
            >

              <div className="font-semibold text-lg">{playerName}</div>

              <div className="text-sm text-gray-600">
                Total : {total}€
              </div>

              <div className="text-sm text-gray-600">
                Payé : {paid}€
              </div>

              <div className="text-sm text-gray-600">
                Reste : {remaining}€
              </div>

              <div className={`font-semibold ${getStatusColor(status)}`}>
                Statut : {status}
              </div>

              <button className="text-blue-600 hover:underline">
                Mettre à jour
              </button>

            </div>
          );
        })}

      </div>

      {/* DESKTOP TABLE */}

      <div className="hidden md:block overflow-x-auto">

        <table className="w-full border-collapse bg-white shadow-md rounded text-gray-700">

          <thead className="bg-gray-200">

            <tr>
              <th className="p-3 text-left">Joueur</th>
              <th className="p-3 text-left">Montant total</th>
              <th className="p-3 text-left">Payé</th>
              <th className="p-3 text-left">Reste</th>
              <th className="p-3 text-left">Statut</th>
              <th className="p-3 text-left">Actions</th>
            </tr>

          </thead>

          <tbody>

            {subscriptions.length === 0 && !loading ? (

              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-600">
                  Aucune cotisation trouvée.
                </td>
              </tr>

            ) : (

              subscriptions.map((s, idx) => {

                const playerName =
                  (s.player &&
                    `${s.player.name || ""} ${s.player.surname || ""}`.trim()) ||
                  `${s.name || ""} ${s.surname || ""}`.trim() ||
                  `#${s.id ?? idx}`;

                const total = s.total_amount ?? s.total ?? 0;
                const paid = s.paid_amount ?? s.paid ?? 0;
                const remaining =
                  s.remaining_amount ??
                  s.remaining ??
                  Math.max(0, total - paid);

                const status =
                  s.status ??
                  (remaining === 0
                    ? "Payé"
                    : paid === 0
                    ? "Non payé"
                    : "Partiel");

                return (

                  <tr key={s.id ?? idx} className="border-b hover:bg-gray-50">

                    <td className="p-3">{playerName}</td>

                    <td className="p-3">{total}€</td>

                    <td className="p-3">{paid}€</td>

                    <td className="p-3">{remaining}€</td>

                    <td className={`p-3 font-semibold ${getStatusColor(status)}`}>
                      {status}
                    </td>

                    <td className="p-3">
                      <button className="text-blue-600 hover:underline">
                        Mettre à jour
                      </button>
                    </td>

                  </tr>

                );

              })

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default GestionCotisations;
