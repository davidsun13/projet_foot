import canon from "../assets/télécharger.jpg";
import userImg from "../assets/profil.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
    <header className="w-full bg-red-600 text-white sticky top-0 z-50">
      
      <div className="w-full max-w-7xl mx-auto px-2 py-1 flex items-center justify-between">

        <Link to="/" className="flex items-center">
          <img
            src={canon}
            alt="Logo"
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
          />
        </Link>

        {}
        <div className="flex items-center gap-3">

          {currentUser && (
            <button
              type="button"
              onClick={handleLogout}
              className="hidden sm:block text-sm bg-white text-[#19202F] px-3 py-1 rounded hover:bg-gray-200 transition"
            >
              Déconnexion
            </button>
          )}

          <img
            src={userImg}
            alt="User"
            className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-full border-2 border-white"
          />

          <p className="hidden md:block text-sm">
            {currentUser
              ? `${currentUser.name} ${currentUser.surname}`
              : "Non connecté"}
          </p>

        </div>
      </div>
    </header>
  );
}

export default Header;
