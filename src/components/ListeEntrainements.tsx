import React from "react";
import { Link } from "react-router-dom";

const ListeEntrainements = () => {
  return (
    <div className="w-full max-w-5xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-[Arsenal] font-bold">Entraînements</h2>
        <Link 
          to="/entrainements/creer"
          className="bg-white text-red-600 px-4 py-2 rounded hover:bg-red-600 hover:text-white font-[Arsenal]"
        >
          + Créer un entraînement
        </Link>
      </div>

      <table className="w-full border-collapse bg-white shadow-md rounded text-gray-700">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Heure</th>
            <th className="p-3 text-left">Lieu</th>
            <th className="p-3 text-left">Équipe</th>
            <th className="p-3 text-left">Statut</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-b">
            <td className="p-3">15/11/2025</td>
            <td className="p-3">19:00</td>
            <td className="p-3">Terrain A</td>
            <td className="p-3">Seniors A</td>
            <td className="p-3 text-green-600 font-semibold">Ouvert</td>
          </tr>
          <tr className="border-b">
            <td className="p-3">17/11/2025</td>
            <td className="p-3">18:30</td>
            <td className="p-3">Terrain B</td>
            <td className="p-3">U18</td>
            <td className="p-3 text-yellow-600 font-semibold">À confirmer</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ListeEntrainements;
