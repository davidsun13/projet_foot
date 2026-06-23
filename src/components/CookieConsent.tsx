import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'cookie_consent';

function CookieConsent() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const saved = typeof window !== 'undefined' && window.localStorage.getItem(COOKIE_CONSENT_KEY);
    setAccepted(saved === 'true');
  }, []);

  const handleAccept = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
      setAccepted(true);
    }
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-50 bg-slate-950 text-white rounded-2xl p-4 shadow-2xl border border-white/10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-sm leading-6">
          <p className="font-semibold">Utilisation des cookies</p>
          <p>
            Ce site utilise des cookies essentiels pour assurer la connexion et la sécurité de votre session. En poursuivant, vous acceptez notre politique de confidentialité.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Link to="/confidentialite" className="text-sm text-sky-300 hover:underline">
            Voir la politique de confidentialité
          </Link>
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-400"
          >
            J’accepte
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
