import { useState, useEffect } from "react";
import { data, useNavigate } from "react-router-dom";

interface Player {
  id_player: number;
  name: string;
  surname: string;
}

const CreationCotisation = () => {
  const navigate = useNavigate();

  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<number | "">("");
  const [total, setTotal] = useState("");
  const [status, setStatus] = useState("Not paid");
  const [paymentDate, setPaymentDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(
          "http://localhost:1234/subscriptions/players",
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Impossible de charger les joueurs");
        }

        const data = await response.json();
        setPlayers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedPlayer) {
      setError("Veuillez sélectionner un joueur");
      return;
    }

    try {
      const response = await fetch("http://localhost:1234/addsubscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id_player: selectedPlayer,
          total: Number(total),
          status,
          payment_date: paymentDate,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la création");
      }

      setSuccess("Cotisation créée avec succès !");

      setTimeout(() => {
        navigate("/cotisations");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Chargement des joueurs...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Création d'une cotisation
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">
            {success}
          </div>
        )}

        {players.length === 0 ? (
          <div className="text-center text-gray-600">
            Tous les joueurs ont déjà une cotisation.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block mb-1 font-medium">
                Joueur
              </label>
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(Number(e.target.value))}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">-- Sélectionner un joueur --</option>
                {players.map((player) => (
                  <option key={player.id_player} value={player.id_player}>
                    {player.name} {player.surname}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Montant (€)
              </label>
              <input
                type="number"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Statut
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="Not paid">En attente</option>
                <option value="Paid">Payée</option>
                <option value="Late">En retard</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Date de paiement
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-black py-2 rounded hover:bg-blue-700 transition"
            >
              Créer la cotisation
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreationCotisation;
