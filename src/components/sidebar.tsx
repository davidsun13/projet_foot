import React from 'react';
import player from '../assets/606545.png';
import ball from '../assets/ballon-de-football.png';
import money from '../assets/pieces-de-monnaie.png' 
function Sidebar() {
  return (
    <aside className="w-64 bg-red-600 text-white min-h-screen p-4 hidden md:block">
      <nav className="space-y-2">
        <a 
  href="#" 
  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700"
>
  <img src={player} alt="Logo" className="w-15 h-15" />
  <span className='text-white'>Entraînements</span>
        </a>
        <a 
  href="#" 
  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700"
>
  <img src={ball} alt="Logo" className="w-15 h-15" />
  <span className='text-white'>Matchs</span>
        </a> 
        <a 
  href="#" 
  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700"
>
  <img src={money} alt="Logo" className="w-15 h-15" />
  <span className='text-white'>Cotisations</span>
        </a> 
      </nav>
    </aside>
  );
}

export default Sidebar;
