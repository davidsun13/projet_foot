import React, { useState } from "react";

const CreationMatch = () => {
  const [formData, setFormData] = useState({
    date: "",
    heure: "",
    adversaire: "",
    lieu: "",
    type: "",
    equipe: "",
    note: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Match créé :", formData);
    alert("Match créé avec succès ✅");
  };

  return (
    <div className="w-full max-w-2xl bg-white shadow-lg rounded p-6">
      <h2 className="text-2xl font-[Arsenal] font-bold mb-4 text-red-600">
        Création d'un match
      </h2>

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
            <option value="Domicile">🏟️ Domicile</option>
            <option value="Exterieur">🚌 Extérieur</option>
          </select>
        </div>

        {/* Type de match */}
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
            <option value="Championnat">Championnat</option>
            <option value="Amical">Amical</option>
            <option value="Coupe">Coupe</option>
          </select>
        </div>

        {/* Équipe */}
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
            <option value="Seniors A">Seniors A</option>
            <option value="Seniors B">Seniors B</option>
            <option value="U18">U18</option>
            <option value="U16">U16</option>
          </select>
        </div>

        {/* Note */}
        <div>
          <label className="block mb-1 font-[Arsenal]">
            Note (optionnel)
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Consignes, points de focus..."
            className="w-full border p-2 rounded"
            rows="3"
          ></textarea>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-red-600 text-black py-2 rounded font-[Arsenal] hover:bg-red-700"
        >
          ✅ Créer le match
        </button>
      </form>
    </div>
  );
};

export default CreationMatch;
