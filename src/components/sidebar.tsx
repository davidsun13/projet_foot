import React from 'react';
import { Link } from "react-router-dom";
import player from '../assets/606545.png';
import ball from '../assets/ballon-de-football.png';
import money from '../assets/pieces-de-monnaie.png';

function Sidebar() {
  return (
    <aside className="w-64 bg-red-600 text-white min-h-screen p-4 hidden md:block">
      <nav className="space-y-2">

        <Link to="/entrainements" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700">
          <img src={player} alt="" className="w-15 h-15" />
          <span className='text-white font-[Arsenal]'>Entraînements</span>
        </Link>

        <Link to="/matchs" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700">
          <img src={ball} alt="" className="w-15 h-15" />
          <span className='text-white font-[Arsenal]'>Matchs</span>
        </Link>

        <Link to="/cotisations" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700">
          <img src={money} alt="" className="w-15 h-15" />
          <span className='text-white font-[Arsenal]'>Cotisations</span>
        </Link>

      </nav>
    </aside>
  );
}

export default Sidebar;
