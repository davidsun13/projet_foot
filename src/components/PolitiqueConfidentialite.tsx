import React from 'react';

function PolitiqueConfidentialite() {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-3xl font-bold mb-4">Politique de confidentialité</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Collecte des données</h2>
        <p>
          Nous recueillons uniquement les données nécessaires au bon fonctionnement du site et à la gestion des comptes utilisateurs.
        </p>
        <p>
          Lors de la connexion et de l'inscription, les informations suivantes peuvent être utilisées : nom, adresse email et identifiants de connexion.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Utilisation des cookies</h2>
        <p>
          Ce site utilise des cookies essentiels pour maintenir la session utilisateur et sécuriser l'accès. Les cookies de session nécessaires sont stockés uniquement si vous acceptez leur utilisation.
        </p>
        <p>
          Le cookie de rafraîchissement d'authentification est utilisé pour prolonger la session de manière sécurisée et n'est pas accessible depuis le code JavaScript côté client.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Sécurité</h2>
        <p>
          Nous mettons en œuvre des mesures techniques et organisationnelles adaptées pour protéger les données personnelles contre l'accès non autorisé, la modification ou la destruction.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Vos droits</h2>
        <p>
          Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant. Pour exercer ces droits, contactez-nous via la page Contact.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <p>
          Pour toute question relative à vos données personnelles, écrivez à <strong>david.sun@edu.ecole-89.com</strong>.
        </p>
      </section>
    </div>
  );
}

export default PolitiqueConfidentialite;
