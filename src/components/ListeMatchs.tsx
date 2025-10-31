import React from "react";
import { Link } from "react-router-dom";

const ListeMatchs = () => {
  return (
    <div className="w-full max-w-5xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-[Arsenal] font-bold">Matchs</h2>
        <Link 
          to="/matchs/creer"
          className="bg-white text-red-600 px-4 py-2 rounded hover:bg-red-600 hover:text-white font-[Arsenal]"
        >
          + Créer un match
        </Link>
      </div>

      <table className="w-full border-collapse bg-white shadow-md rounded text-gray-700">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Heure</th>
            <th className="p-3 text-left">Adversaire</th>
            <th className="p-3 text-left">Lieu</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Statut</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-b">
            <td className="p-3">20/11/2025</td>
            <td className="p-3">15:00</td>
            <td className="p-3">AS Lyon</td>
            <td className="p-3">Domicile</td>
            <td className="p-3">Championnat</td>
            <td className="p-3 text-green-600 font-semibold">Programmé</td>
          </tr>

          <tr className="border-b">
            <td className="p-3">27/11/2025</td>
            <td className="p-3">16:30</td>
            <td className="p-3">FC Nice</td>
            <td className="p-3">Extérieur</td>
            <td className="p-3">Amical</td>
            <td className="p-3 text-yellow-600 font-semibold">En attente</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ListeMatchs;
