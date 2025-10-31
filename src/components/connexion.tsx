import React from 'react';
import Button from './button';
function Connexion() {
  return (
    <div className="flex items-center justify-center h-full w-full bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md max-h-full overflow-auto">
        <h2 className="text-2xl font-[Arsenal]-Bold mb-6 text-center">Connexion</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-[Arsenal] text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="exemple@email.com"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-[Arsenal] text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <Button 
            size="sm"
            variant="secondary"
            type="submit"
            className="w-full bg-red-600 text-black py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            Se connecter
          </Button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Pas encore de compte? <a href="#" className="text-red-600 hover:underline">S’inscrire</a>
        </p>
      </div>
    </div>
  );
}

export default Connexion;
