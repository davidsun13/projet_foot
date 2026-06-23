import React from 'react';

function MentionsLegales() {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-3xl font-bold mb-4">Mentions légales</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Éditeur du site</h2>
        <p>Ce site est édité par :</p>
        <ul className="list-disc list-inside mb-2">
          <li>Nom / Association : <strong>David SUN</strong></li>
          <li>Adresse : <strong>72 rue de la tour d'auvergne,77185 Lognes</strong></li>
          <li>Email : <strong>david.sun@edu.ecole-89.com</strong></li>
        </ul>
        <p>
          Pour toute question concernant ce site, veuillez utiliser la page <strong>Contact</strong>.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Hébergement</h2>
        <p>
          Le site est hébergé par un prestataire technique et peut être déployé sur un hébergeur conforme aux bonnes pratiques de sécurité et de confidentialité.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Propriété intellectuelle</h2>
        <p>
          L'ensemble des éléments présents sur ce site (textes, images, graphiques, logos, base de données) est protégé par le droit de la propriété intellectuelle.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Données personnelles</h2>
        <p>
          Les informations personnelles collectées via ce site sont traitées conformément à notre <strong>Politique de confidentialité</strong>.
        </p>
      </section>
    </div>
  );
}

export default MentionsLegales;
