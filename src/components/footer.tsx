import React from 'react';

function Footer() {
  return (
    <footer className="w-full text-white mt-auto" style={{ backgroundColor: '#19202F' }}>
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center md:items-center justify-between gap-4">

        <p className="text-sm text-center md:text-left font-[Arsenal]">
          &copy; 2025 MonSite. Tous droits réservés.
        </p>

        <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
          <p className="font-[Arsenal] cursor-pointer hover:underline">Mentions légales</p>
          <p className="font-[Arsenal] cursor-pointer hover:underline">Confidentialité</p>
          <p className="font-[Arsenal] cursor-pointer hover:underline">Contact</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
