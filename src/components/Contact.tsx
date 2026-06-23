import React from 'react';

function Contact() {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-3xl font-bold mb-4">Contact</h1>

      <p className="mb-4">
        Pour toute question, demande de support ou information sur vos droits, contactez-nous via les informations ci-dessous.
      </p>

      <ul className="list-disc list-inside space-y-2 mb-6">
        <li>
          <strong>Email :</strong> <a href="mailto:david.sun@edu.ecole-89.com" className="text-blue-600 hover:underline">david.sun@edu.ecole-89.com</a>
        </li>
        <li>
          <strong>Téléphone :</strong> <a href="tel:+33767560481" className="text-blue-600 hover:underline">+33 7 67 56 04 81</a>
        </li>
        <li>
          <strong>Adresse :</strong> 72 rue de la tour d'auvergne, 77185 Lognes
        </li>
      </ul>

      <p>
        Nous nous engageons à répondre à vos demandes dans les meilleurs délais. Ces informations peuvent être mises à jour en fonction de l'organisation de votre structure.
      </p>
    </div>
  );
}

export default Contact;
