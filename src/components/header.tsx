import canon from '../assets/télécharger.jpg';
import user from '../assets/profil.png' ;
import {Link} from 'react-router-dom';

function Header() {
  return (
    <header className="relative w-full bg-red-600 text-white sticky top-0 z-50 h-20 md:h-24">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <Link to="/">
          <img src={canon} alt="Logo" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
        </Link>
      </div>

      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-3">
        <img src={user} alt="User" className="w-12 h-12 md:w-16 md:h-16 object-contain rounded-full border-2 border-white" />
        <p className="hidden md:block md:text-sm">Nom d'utilisateur</p>
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-center h-full px-8">
        <div className="text-2xl md:text-3xl font-bold">
        </div>
      </div>
    </header>
  );
}

export default Header;
