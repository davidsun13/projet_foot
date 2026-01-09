import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./button";

function Connexion() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [userType, setUserType] = useState<"player" | "coach">("player"); // default = joueur

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.id]: e.target.value });
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const endpoint = userType === "player" ? "/login" : "/logincoach";

      const res = await fetch(`http://localhost:1234${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mail: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Identifiants incorrects.");
        return;
      }

      if (data.accessToken) {
        localStorage.setItem("access_token", data.accessToken);
      }
      localStorage.setItem("userType", userType);
      navigate("/");
      window.location.reload();
    } catch (err) {
      setError("Erreur réseau : " + (err as Error).message);
    }
  }

  return (
    <div className="flex items-center justify-center h-full w-full bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md max-h-full overflow-auto">
        <h2 className="text-2xl font-bold mb-6 text-center font-[Arsenal]">
          Connexion
        </h2>

        {error && <p className="text-center text-red-600 mb-4">{error}</p>}

        {/* Optionnel : bouton pour choisir joueur ou coach */}
        <div className="mb-4 text-center">
          <button
            type="button"
            onClick={() => setUserType("player")}
            className={`px-4 py-2 mr-2 rounded ${userType === "player" ? "bg-red-600 text-black" : "bg-gray-200"}`}
          >
            Joueur
          </button>
          <button
            type="button"
            onClick={() => setUserType("coach")}
            className={`px-4 py-2 rounded ${userType === "coach" ? "bg-red-600 text-black" : "bg-gray-200"}`}
          >
            Coach
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="exemple@email.com"
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-red-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-red-500"
            />
          </div>

          <Button
            type="submit"
            size="sm"
            variant="secondary"
            className="w-full bg-red-600 py-2 rounded-md hover:bg-red-700"
          >
            Se connecter
          </Button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Pas encore de compte ?{" "}
          <a href="/inscription" className="text-red-600 hover:underline">
            S’inscrire
          </a>
        </p>
      </div>
    </div>
  );
}

export default Connexion;
