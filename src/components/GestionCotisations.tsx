import React from "react";

export const GestionCotisations = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestion des cotisations</h1>

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
            {/* Exemple ligne */}
            <tr className="border-b">
              <td className="p-2">Ahmed Diop</td>
              <td className="p-2">120€</td>
              <td className="p-2">60€</td>
              <td className="p-2">60€</td>
              <td className="p-2 text-yellow-600 font-semibold">Partiel</td>
              <td className="p-2">
                <button className="text-blue-600 hover:underline">Mettre à jour</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionCotisations;