import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import training from "../assets/1540533.png";
import player from "../assets/606545.png";
import ball from "../assets/signe.png";
import money from "../assets/pieces-de-monnaie.png";
import convocation from "../assets/liste-de-controle.png";

type MeResponse = {
  userType: "player" | "coach";
  user: {
    id_player?: number;
    id_coach?: number;
    name: string;
    surname: string;
  };
};

function Sidebar() {
  const [currentUser, setCurrentUser] = useState<MeResponse | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:1234/me", {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (!res.ok) return;

        const data: MeResponse = await res.json();
        setCurrentUser(data);
      } catch {
        console.log("Utilisateur non connecté");
      }
    }

    fetchUser();
  }, []);

  return (
    <aside className="w-64 bg-red-600 text-white min-h-screen p-4 hidden md:block">
      <nav className="space-y-2">
        <Link
          to="/entrainements"
          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700"
        >
          <img src={training} alt="" className="w-15 h-15" />
          <span className="text-white font-[Arsenal]">Entraînements</span>
        </Link>

        <Link
          to="/matchs"
          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700"
        >
          <img src={ball} alt="" className="w-15 h-15" />
          <span className="text-white font-[Arsenal]">Matchs</span>
        </Link>

        <Link
          to="/cotisations"
          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700"
        >
          <img src={money} alt="" className="w-15 h-15" />
          <span className="text-white font-[Arsenal]">Cotisations</span>
        </Link>

        {/* 🔒 Visible uniquement pour les coachs */}
        {currentUser?.userType === "coach" && (
          <Link
            to="/players"
            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700"
          >
            <img src={player} alt="" className="w-15 h-15" />
            <span className="text-white font-[Arsenal]">Joueurs</span>
          </Link>
        )}
        {/* 🔒 Visible uniquement pour les coachs */}
        {currentUser?.userType === "coach" && (
          <Link
            to="/convocations"
            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700"
          >
            <img src={convocation} alt="" className="w-15 h-15" />
            <span className="text-white font-[Arsenal]">Convocations</span>
          </Link>
        )}
        {/* 🔒 Visible uniquement pour les joueurs */}
        {currentUser?.userType === "player" && (
          <Link
            to={`/player-profile/${currentUser.user.id_player}`}
            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700"
          >
            <img src={player} alt="" className="w-15 h-15" />
            <span className="text-white font-[Arsenal]">Profil</span>
          </Link>
        )}
        {currentUser?.userType === "player" && (
          <Link
            to={`/convocations/${currentUser.user.id_player}`}
            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700"
          >
            <img src={convocation} alt="" className="w-15 h-15" />
            <span className="text-white font-[Arsenal]">Convocations</span>
          </Link>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
