import canon from '../assets/télécharger.jpg';
import userImg from '../assets/profil.png';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Header() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();

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

        const data = await res.json();
        setCurrentUser(data.user);
      } catch (err) {
        console.log("Not logged in");
      }
    }
    fetchUser();
  }, []);

  async function handleLogout() {
    try {
      await fetch("http://localhost:1234/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Erreur logout");
    }

    localStorage.removeItem("access_token");
    setCurrentUser(null);
    navigate("/connexion");
    window.location.reload();
  }

  return (
    <header className="relative w-full bg-red-600 text-white sticky top-0 z-50 h-20 md:h-24">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <Link to="/">
          <img
            src={canon}
            alt="Logo"
            className="w-16 h-16 md:w-20 md:h-20 object-contain"
          />
        </Link>
      </div>

      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-3">
        {currentUser && (
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm bg-white text-red-600 px-3 py-1 rounded hover:bg-gray-100 transition"
          >
            Déconnexion
          </button>
        )}

        <img
          src={userImg}
          alt="User"
          className="w-12 h-12 md:w-16 md:h-16 object-contain rounded-full border-2 border-white"
        />

        <p className="hidden md:block md:text-sm">
          {currentUser
            ? `${currentUser.name} ${currentUser.surname}`
            : "Non connecté"}
        </p>
      </div>
    </header>
  );
}

export default Header;
