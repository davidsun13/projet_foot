import React from 'react';

function Connexion() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
        <form className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="exemple@email.com"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Bouton */}
          <button
            type="submit"
            className="w-full bg-red-600 text-black py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            Se connecter
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Pas encore de compte? <a href="#" className="text-red-600 hover:underline">S’inscrire</a>
        </p>
      </div>
    </div>
  );
}

export default Connexion;
