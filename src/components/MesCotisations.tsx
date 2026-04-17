import React, { useEffect, useState } from "react";
import { fetchAuth } from "../utils/fetchAuth";

type Subscription = {
  id_subscription: number;
  total: number;
  status: string;
  payment_date: string | null;
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

export const MesCotisations = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [currentUser, setCurrentUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserAndSubscriptions() {
      setLoading(true);
      setError(null);

      try {
        // First, get current user
        const meRes = await fetchAuth("http://localhost:1234/me");
        if (!meRes.ok) {
          throw new Error("Utilisateur non connecté");
        }
        const meData: MeResponse = await meRes.json();
        setCurrentUser(meData);

        if (meData.userType !== "player" || !meData.user.id_player) {
          throw new Error("Accès réservé aux joueurs");
        }

        // Then, get subscriptions
        const subRes = await fetchAuth(`http://localhost:1234/subscriptions/player/${meData.user.id_player}`);
        if (!subRes.ok) {
          throw new Error("Erreur lors du chargement des cotisations");
        }
        const subData: Subscription[] = await subRes.json();
        setSubscriptions(subData);
      } catch (err) {
        setError((err as Error).message);
      }

      setLoading(false);
    }

    fetchUserAndSubscriptions();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "text-green-600";
      case "not paid":
        return "text-red-600";
      case "late":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "Payé";
      case "not paid":
        return "Non payé";
      case "late":
        return "En retard";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <p>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Mes cotisations
      </h1>

      {subscriptions.length === 0 ? (
        <div className="text-center text-gray-500">
          Aucune cotisation trouvée.
        </div>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((s) => (
            <div
              key={s.id_subscription}
              className="bg-white border shadow rounded-lg p-6 space-y-3"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  Cotisation #{s.id_subscription}
                </h2>
                <span className={`font-semibold ${getStatusColor(s.status)}`}>
                  {getStatusText(s.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Montant total :</span> {s.total}€
                </div>
                <div>
                  <span className="font-medium">Date de paiement :</span>{" "}
                  {s.payment_date ? new Date(s.payment_date).toLocaleDateString('fr-FR') : "Non payé"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MesCotisations;