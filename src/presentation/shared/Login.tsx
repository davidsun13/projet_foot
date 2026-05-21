import React, { useState } from 'react';
import { useAuth } from '../../application/hooks';
import { Card } from './Card';
import { Button } from './Button';

export function Login() {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'player' | 'coach'>('player');
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(mail, password, userType);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <Card title="Connexion" className="max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={mail}
            onChange={e => setMail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={userType}
            onChange={e => setUserType(e.target.value as 'player' | 'coach')}
            className="w-full border rounded px-3 py-2"
          >
            <option value="player">Joueur</option>
            <option value="coach">Entraîneur</option>
          </select>
        </div>

        <Button type="submit" isLoading={loading} className="w-full">
          Se connecter
        </Button>
      </form>
    </Card>
  );
}
