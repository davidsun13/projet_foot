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
  const [open, setOpen] = useState(false);

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
    <>
      <button
        className="md:hidden fixed top-24 left-4 z-50 bg-red-600 text-white px-3 py-2 rounded"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 w-48 bg-red-600 text-white p-4 transform transition-transform duration-300 z-50
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        <nav className="space-y-3 mt-16 md:mt-0">
          <Link
            to="/entrainements"
            className="flex items-center gap-3 p-2 rounded hover:bg-red-700"
            onClick={() => setOpen(false)}
          >
            <img src={training} alt="" className="w-10 h-10" />
            <span className="font-[Arsenal] text-white">Entraînements</span>
          </Link>

          <Link
            to="/matchs"
            className="flex items-center gap-3 p-2 rounded hover:bg-red-700"
            onClick={() => setOpen(false)}
          >
            <img src={ball} alt="" className="w-10 h-10" />
            <span className="font-[Arsenal] text-white">Matchs</span>
          </Link>


          {currentUser?.userType === "coach" && (
            <Link
              to="/cotisations"
              className="flex items-center gap-3 p-2 rounded hover:bg-red-700"
              onClick={() => setOpen(false)}
            >
            <img src={money} alt="" className="w-10 h-10" />
            <span className="font-[Arsenal] text-white">Cotisations</span>
          </Link>
          )}
          {currentUser?.userType === "coach" && (
            <Link
              to="/players"
              className="flex items-center gap-3 p-2 rounded hover:bg-red-700"
              onClick={() => setOpen(false)}
            >
              <img src={player} alt="" className="w-10 h-10" />
              <span className="font-[Arsenal] text-white">Joueurs</span>
            </Link>
          )}

          {currentUser?.userType === "player" && (
            <Link
              to={`/player-profile/${currentUser.user.id_player}`}
              className="flex items-center gap-3 p-2 rounded hover:bg-red-700"
              onClick={() => setOpen(false)}
            >
              <img src={player} alt="" className="w-10 h-10" />
              <span className="font-[Arsenal] text-white">Profil</span>
            </Link>
          )}

          {currentUser?.userType === "player" && (
            <Link
              to={`/convocations/${currentUser.user.id_player}`}
              className="flex items-center gap-3 p-2 rounded hover:bg-red-700"
              onClick={() => setOpen(false)}
            >
              <img src={convocation} alt="" className="w-10 h-10" />
              <span className="font-[Arsenal] text-white">Convocations</span>
            </Link>
          )}

          {currentUser?.userType === "player" && (
            <Link
              to="/mes-cotisations"
              className="flex items-center gap-3 p-2 rounded hover:bg-red-700"
              onClick={() => setOpen(false)}
            >
              <img src={money} alt="" className="w-10 h-10" />
              <span className="font-[Arsenal] text-white">Mes Cotisations</span>
            </Link>
          )}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
