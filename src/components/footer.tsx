import React from 'react';

function Footer() {
  return (
    <footer className="w-full bg-red-600 text-white mt-auto"style={{ backgroundColor: '#19202F' }}>
      <div className="max-w-7xl mx-auto py-4 px-4 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm">&copy; 2025 MonSite. Tous droits réservés.</p>

        <div className="flex space-x-4 mt-2 md:mt-0">
          <p>Mentions légales</p>
          <p>Confidentialité</p>
          <p>Contact</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
