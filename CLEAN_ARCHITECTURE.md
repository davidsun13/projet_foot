# Clean Architecture Guide

Ce document explique la structure de clean architecture implémentée dans ce projet.

## 📐 Architecture Overview

### 🔷 Principe fondamental
La clean architecture sépare l'application en couches indépendantes, avec des dépendances unidirectionnelles vers le centre.

```
Frontend                          Backend
───────────────────────────────────────────
Presentation (UI)                 Presentation (Routes)
    ↓                                  ↓
Application (Services/Hooks)      Application (Services)
    ↓                                  ↓
Domain (Models/Types)             Domain (Entities/Types)
    ↓                                  ↓
Infrastructure                    Infrastructure (DB/Repos)
```

## 📂 Structure Backend (`Back/src/`)

### `domain/`
**Contient** : Entités métier et types
- `types.ts` : Définition des interfaces (Player, Coach, Match, Training, etc.)

**Responsabilité** : Décrire la structure des données métier

```typescript
// Exemple: domain/types.ts
export interface Player {
  id_player: number;
  name: string;
  mail: string;
  // ...
}
```

### `application/`
**Contient** : Logique métier (Use Cases / Services)
- `AuthService.ts` : Gestion de l'authentification
- `MatchService.ts` : Logique des matchs
- `TrainingService.ts` : Logique des entraînements
- `CotisationService.ts` : Logique des cotisations

**Responsabilité** : Implémentation de la logique métier indépendante du framework

```typescript
// Exemple: application/MatchService.ts
export class MatchService {
  async create(data: Omit<Match, 'id_match'>): Promise<Match> {
    // Validation métier
    if (!data.date || !data.opponent) {
      throw new ValidationError("Champs requis manquants");
    }
    // Appel au repository
    return this.matchRepository.create(data);
  }
}
```

### `infrastructure/database/`
**Contient** : Repositories et accès aux données
- `repository.ts` : Implémentation des repos (PlayerRepository, MatchRepository, etc.)

**Responsabilité** : Abstraction de la base de données

```typescript
// Exemple: infrastructure/database/repository.ts
export class MatchRepository {
  async create(data: Omit<Match, 'id_match'>): Promise<Match> {
    return await this.sqlClient`...`;
  }
}
```

### `presentation/routes/`
**Contient** : Routes et handlers Fastify
- `auth.routes.ts` : Routes d'authentification (register, login, logout)
- `match.routes.ts` : Routes des matchs (CRUD)
- `training.routes.ts` : Routes des entraînements (CRUD)
- `cotisation.routes.ts` : Routes des cotisations (CRUD)
- `index.ts` : Réexport de toutes les routes

**Responsabilité** : Recevoir les requêtes HTTP, valider les données, appeler les services

```typescript
// Exemple: presentation/routes/match.routes.ts
export async function matchRoutes(fastify: FastifyInstance, matchRepo: MatchRepository) {
  const matchService = new MatchService(matchRepo);

  fastify.get("/api/matches", async (request, reply) => {
    const matches = await matchService.getAll();
    return reply.send(matches);
  });
}
```

### `bootstrap.ts`
**Contient** : Initialisation du serveur Fastify avec toutes les dépendances

```typescript
// Démarrage du serveur
const { web_server, start } = await start_web_server();
await start();
```

### `shared/`
**Contient** : Types et utilitaires partagés
- `errors.ts` : Classes d'erreur personnalisées

## 📂 Structure Frontend (`src/`)

### `domain/`
**Contient** : Modèles et types métier
- `models.ts` : Définition des interfaces

### `application/`
**Contient** : Services et hooks personnalisés

#### `services/`
- `api.ts` : Services API pour communiquer avec le backend

```typescript
// Exemple: application/services/api.ts
export const matchService = {
  async getAll(): Promise<Match[]> {
    const response = await fetch(`${API_BASE}/matches`);
    return handleResponse(response);
  },
};
```

#### `hooks/`
- `index.ts` : Hooks React personnalisés (useMatches, useTrainings, etc.)

```typescript
// Exemple: application/hooks/index.ts
export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const fetchMatches = useCallback(async () => {
    const data = await matchService.getAll();
    setMatches(data);
  }, []);
  return { matches, fetchMatches };
}
```

### `presentation/`

#### `shared/`
**Contient** : Composants réutilisables
- `Button.tsx` : Boutons avec variantes
- `Card.tsx` : Cartes conteneurs
- `Header.tsx` : En-tête
- `Footer.tsx` : Pied de page
- `Sidebar.tsx` : Navigation
- `Login.tsx` : Formulaire de connexion

**Règle** : Pas de logique métier, juste du UI

#### `features/`
**Contient** : Modules feature-based
- `matches/` : Tout ce qui concerne les matchs
  - `MatchesList.tsx` : Afficher les matchs
  - `CreateMatch.tsx` : Créer un match
  - `index.ts` : Réexport
- `trainings/` : Entraînements
- `cotisations/` : Cotisations
- `players/` : Joueurs

**Structure d'une feature** :
```
features/matches/
  ├── MatchesList.tsx      (affichage)
  ├── CreateMatch.tsx      (création)
  ├── EditMatch.tsx        (édition)
  ├── MatchDetails.tsx     (détails)
  └── index.ts             (réexport)
```

#### `pages/`
**Contient** : Pages complètes de l'application
- `Dashboard.tsx` : Tableau de bord
- `LoginPage.tsx` : Page de connexion
- `MatchesPage.tsx` : Page des matchs
- `TrainingsPage.tsx` : Page des entraînements
- `CotisationsPage.tsx` : Page des cotisations

**Règle** : Les pages combinent Header + Sidebar + Feature + Footer

### `shared/`
**Contient** : Types et utilitaires partagés
- À créer : constantes, helpers, etc.

## 🔄 Flux de données

### Côté Backend
```
Request HTTP
    ↓
Route/Handler (presentation/routes/)
    ↓
Service (application/)
    ↓
Repository (infrastructure/database/)
    ↓
Database
    ↓
Response JSON
```

### Côté Frontend
```
User Interaction
    ↓
Component (presentation/features/)
    ↓
Hook (application/hooks/)
    ↓
API Service (application/services/)
    ↓
Backend API
    ↓
UI Update (setState)
```

## 📝 Bonnes pratiques

### 1. **Dépendances unidirectionnelles**
❌ Mauvais :
```typescript
// Dans domain/types.ts
import { Repository } from '../infrastructure/database/repository';
```

✅ Bon :
```typescript
// Domain ne dépend de rien
export interface Player { ... }
```

### 2. **Logique métier dans Application**
❌ Mauvais :
```typescript
// Dans un composant React
const player = await fetch(...);
if (player.status === 'Inactif') { /* logique */ }
```

✅ Bon :
```typescript
// Dans un hook
const { status } = usePlayerStatus(id);
// Dans un service
const isPlayerActive = (player: Player) => player.status === 'Actif';
```

### 3. **Réutilisabilité des composants**
Composants `shared/` : UI pure, réutilisables
Composants `features/` : Logique métier + UI

### 4. **Gestion des erreurs**
- Backend : Classes d'erreur dans `shared/errors.ts`
- Frontend : Gestion via les hooks (loading, error)

## 🚀 Ajouter une nouvelle feature

### Exemple : Ajouter "Convocations"

**1. Backend**
```
Back/src/
├── domain/types.ts ← ajouter Convocation
├── application/ConvocationService.ts ← créer service
├── infrastructure/database/repository.ts ← ajouter ConvocationRepository
└── presentation/routes/convocation.routes.ts ← créer routes
```

**2. Frontend**
```
src/
├── domain/models.ts ← ajouter Convocation
├── application/services/api.ts ← ajouter convocationService
├── application/hooks/index.ts ← ajouter useConvocations()
└── presentation/features/convocations/
    ├── ConvocationsList.tsx
    ├── ConvocationDetail.tsx
    └── index.ts
```

## ⚙️ Intégration et Configuration

### Backend - Mise à jour du serveur

Remplacez votre `server.ts` par le code du `bootstrap.ts` pour utiliser la nouvelle architecture :

```typescript
// Dans main.ts ou index.ts
import { start_web_server } from './presentation/bootstrap';

const { start } = await start_web_server();
await start();
```

### Frontend - Mise à jour de App.tsx

Utilisez les pages et composants de la nouvelle structure :

```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { 
  Dashboard, 
  LoginPage, 
  MatchesPage, 
  TrainingsPage,
  CotisationsPage 
} from './presentation/pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/trainings" element={<TrainingsPage />} />
        <Route path="/cotisations" element={<CotisationsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## 📚 Ressources

- [Uncle Bob - Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Fastify Documentation](https://www.fastify.io/)
- [React Hooks Documentation](https://react.dev/reference/react)

---

**Maintenant votre projet suit une clean architecture robuste et scalable !** 🎉
