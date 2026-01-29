import React, { useEffect, useState } from "react";

type Team = {
  id_team: number;
  name: string;
};

const CreationMatch = () => {
  const [formData, setFormData] = useState({
    date: "",
    heure: "",
    adversaire: "",
    lieu: "",
    type: "",
    equipe: "", // id_team en string
    score_home: "",
    score_outside: "",
    id_coach: "",
  });

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Charger les équipes dynamiquement
  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await fetch("http://localhost:1234/teams", {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
          },
        });
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data = await res.json();
        setTeams(data);
      } catch (err) {
        console.error("Impossible de charger les équipes:", err);
      }
    }
    fetchTeams();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 🔹 Payload nettoyé : jamais undefined
      const payload = {
        date: formData.date || "",
        hour: formData.heure || "",
        opponent: formData.adversaire || "",
        location: formData.lieu || "",
        type: formData.type || "",
        id_team: formData.equipe ? Number(formData.equipe) : null,
        score_home: 0, // score par défaut
        score_outside: 0, // score par défaut
        id_coach: 1, // coach par défaut
      };

      console.log("Payload envoyé 👉", payload);

      const res = await fetch("http://localhost:1234/creatematch", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || `Erreur ${res.status}`);
      }

      const data = await res.json();
      console.log("Match créé :", data);
      alert("Match créé avec succès ✅");

      // 🔹 Reset du formulaire
      setFormData({
        date: "",
        heure: "",
        adversaire: "",
        lieu: "",
        type: "",
        equipe: "",
        score_home: "",
        score_outside: "",
        id_coach: "",
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white shadow-lg rounded p-6">
      <h2 className="text-2xl font-[Arsenal] font-bold mb-4 text-red-600">
        Création d'un match
      </h2>

      {error && <p className="text-red-600 mb-3 break-words">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date */}
        <div>
          <label className="block mb-1 font-[Arsenal]">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Heure */}
        <div>
          <label className="block mb-1 font-[Arsenal]">Heure</label>
          <input
            type="time"
            name="heure"
            value={formData.heure}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Adversaire */}
        <div>
          <label className="block mb-1 font-[Arsenal]">Adversaire</label>
          <input
            type="text"
            name="adversaire"
            value={formData.adversaire}
            onChange={handleChange}
            placeholder="Nom du club adverse"
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Lieu */}
        <div>
          <label className="block mb-1 font-[Arsenal]">Lieu</label>
          <select
            name="lieu"
            value={formData.lieu}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Sélectionner...</option>
            <option value="Home">🏟️ Domicile</option>
            <option value="Outside">🚌 Extérieur</option>
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block mb-1 font-[Arsenal]">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Sélectionner...</option>
            <option value="Championship">Championnat</option>
            <option value="Friendly">Amical</option>
            <option value="Cup">Coupe</option>
          </select>
        </div>

        {/* Équipe dynamique */}
        <div>
          <label className="block mb-1 font-[Arsenal]">Équipe</label>
          <select
            name="equipe"
            value={formData.equipe}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Sélectionner...</option>
            {teams.map((team) => (
              <option key={team.id_team} value={team.id_team}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-black py-2 rounded font-[Arsenal] hover:bg-red-700"
        >
          {loading ? "Création..." : "✅ Créer le match"}
        </button>
      </form>
    </div>
  );
};

export default CreationMatch;
