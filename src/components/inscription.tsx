import React, { useState } from 'react';

function Inscription() {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.id]: e.target.value });
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nom || !form.prenom || !form.email || !form.password || !form.confirmPassword) {
      setError('Tous les champs sont requis.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
  }

  return (
    <div className="flex items-center justify-center h-full w-full bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center font-[Arsenal]">Inscription</h2>

        {error && <div className="mb-4 text-sm text-red-600 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="nom" className="block text-sm font-[Arsenal] text-gray-700">Nom</label>
              <input id="nom" type="text" value={form.nom} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500" />
            </div>

            <div>
              <label htmlFor="prenom" className="block text-sm font-[Arsenal] text-gray-700">Prénom</label>
              <input id="prenom" type="text" value={form.prenom} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500" />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-[Arsenal] text-gray-700">Email</label>
            <input id="email" type="email" value={form.email} onChange={handleChange} placeholder="exemple@email.com"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-[Arsenal] text-gray-700">Mot de passe</label>
              <input id="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500" />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-[Arsenal] text-gray-700">Confirmer</label>
              <input id="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500" />
            </div>
          </div>

          <button type="submit" className="w-full bg-red-600 text-black py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
            S'inscrire
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Déjà inscrit? <a href="#" className="text-red-600 hover:underline">Se connecter</a>
        </p>
      </div>
    </div>
  );
}

export default Inscription;