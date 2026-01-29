📌 Présentation du projet

Ce projet est une application web de gestion d’un club sportif.
Elle permet de gérer :

les joueurs et les équipes

les entraîneurs (coach / administrateur)

les matchs et entraînements

les convocations

la présence

les statistiques de match

les cotisations

l’authentification sécurisée (JWT, refresh token)

L’application est composée d’un frontend React et d’un backend Node.js (Fastify), avec une base de données PostgreSQL conteneurisée via Docker.

🧱 Architecture du projet
projet-club/
│
├── Front/                 # Application React
│   ├── src/
│   └── package.json
│
├── Back/                  # API Fastify
│   ├── src/
│   ├── initdb.d/           # Scripts SQL (création + seed)
│   ├── docker-compose.yml
│   └── package.json
│
└── README.md

🛠️ Technologies utilisées
Frontend

React

TypeScript

Tailwind CSS

React Router

Backend

Node.js

Fastify

TypeScript

Zod (validation)

Argon2 (hash des mots de passe)

JWT (access token)

Cookies HTTP-only (refresh token)

Base de données

PostgreSQL 16

Docker & Docker Compose

🔐 Sécurité

Le projet met en place plusieurs mesures de sécurité :

Hash des mots de passe avec Argon2

Authentification via Access Token JWT

Refresh Token stocké en base, révocable

Refresh token stocké dans un cookie HTTP-only

Protection contre :

SQL Injection (requêtes préparées)

XSS (cookies HTTP-only, pas de JWT en JS)

CSRF (SameSite + refresh sécurisé)

Séparation des rôles player / coach

🚀 Installation et lancement
Prérequis

Node.js (v18+ recommandé)
Docker & Docker Compose

🔹 Lancer la base de données

Depuis le dossier Back :
docker compose up -d


➡️ Cela lance PostgreSQL et initialise automatiquement la base grâce aux scripts SQL.

🔹 Lancer le backend
cd Back
npm install
node Back/src/server.js


API disponible sur :

http://localhost:1234

🔹 Lancer le frontend
cd Front
npm install
npm run dev


Application disponible sur :

http://localhost:5173

🗄️ Base de données

La base est initialisée automatiquement grâce au dossier :

Back/initdb.d/


Il contient :

la création des tables (MLD)

les ENUM

les contraintes

des données de test (seed)

🔁 Réinitialisation de la base de données

Pour repartir d’une base propre :
docker compose down -v
docker compose up -d


➡️ Supprime les données et relance l’initialisation.

🧪 Comptes de test

Rôle	       Email	        Mot de passe

Coach	  jean.dupont@club.com   mdp123
Joueur	paul.durand@mail.com   pass1


📊 Fonctionnalités principales
Coach (admin)

Créer / modifier / supprimer :

matchs

entraînements

Convoquer une équipe entière

Saisir les présences

Ajouter les statistiques

Voir les cotisations

Joueur

Voir ses matchs et entraînements convoqués

Consulter ses statistiques

Voir l’état de sa cotisation

📐 Modélisation

MCD : entités Player, Coach, Team, Match, Training, etc.

MLD conforme au MCD

Diagrammes :

Use Case

Séquence

Classes

🧑‍💻 Auteur

Projet réalisé par David SUN
Dans le cadre d’un projet de formation 

✅ Compétences couvertes

CP1 : Installation, configuration, déploiement

CP10 : Base de données, migration, ré-initialisation

Sécurité web

Architecture client / serveur

Modélisation de données
