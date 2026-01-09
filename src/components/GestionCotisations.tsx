import React, { useEffect, useState } from "react";

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

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Impossible de charger les cotisations");
      }

      const data = await res.json();
      // backend may return array or { subscriptions: [...] }
      const list: Subscription[] = Array.isArray(data) ? data : data.subscriptions || [];
      setSubscriptions(list);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Gestion des cotisations</h1>
      </div>

      {/* Filtre & recherche */}
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

      {/* Tableau des cotisations */}
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Joueur</th>
              <th className="p-2 text-left">Montant total</th>
              <th className="p-2 text-left">Payé</th>
              <th className="p-2 text-left">Reste à payer</th>
              <th className="p-2 text-left">Statut</th>
              <th className="p-2 text-left">Actions</th>
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
                  (s.player && `${s.player.name || ""} ${s.player.surname || ""}`.trim()) ||
                  `${s.name || ""} ${s.surname || ""}`.trim() ||
                  `#${s.id ?? idx}`;

                const total = s.total_amount ?? s.total ?? 0;
                const paid = s.paid_amount ?? s.paid ?? 0;
                const remaining = s.remaining_amount ?? s.remaining ?? Math.max(0, total - paid);
                const status = s.status ?? (remaining === 0 ? "Payé" : paid === 0 ? "Non payé" : "Partiel");

                return (
                  <tr key={s.id ?? idx} className="border-b">
                    <td className="p-2">{playerName}</td>
                    <td className="p-2">{total}€</td>
                    <td className="p-2">{paid}€</td>
                    <td className="p-2">{remaining}€</td>
                    <td className="p-2 text-yellow-600 font-semibold">{status}</td>
                    <td className="p-2">
                      <button className="text-blue-600 hover:underline">Mettre à jour</button>
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
