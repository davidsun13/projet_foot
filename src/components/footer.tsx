import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="w-full text-white mt-auto" style={{ backgroundColor: '#19202F' }}>
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center md:items-center justify-between gap-4">

        <p className="text-sm text-center md:text-left font-[Arsenal]">
          &copy; 2025 MonSite. Tous droits réservés.
        </p>

        <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
          <Link to="/mentions-legales" className="font-[Arsenal] hover:underline">
            Mentions légales
          </Link>
          <Link to="/confidentialite" className="font-[Arsenal] hover:underline">
            Confidentialité
          </Link>
          <Link to="/contact" className="font-[Arsenal] hover:underline">
            Contact
          </Link>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
