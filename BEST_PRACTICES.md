# Guide des Bonnes Pratiques - Clean Architecture

## 🎯 Objectifs

1. **Maintenabilité** : Code facile à maintenir et à modifier
2. **Testabilité** : Code facile à tester en isolation
3. **Scalabilité** : Facile d'ajouter de nouvelles features
4. **Indépendance** : Logique métier indépendante du framework

---

## ✅ À FAIRE

### Backend

#### Domain Layer
```typescript
// ✅ BON : Types purs sans dépendances externes
export interface Match {
  id_match: number;
  date: string;
  opponent: string;
  score_home: number;
  score_outside: number;
}

// ✅ BON : Erreurs métier spécifiques
export class MatchNotFoundError extends Error {
  constructor() {
    super("Match not found");
  }
}
```

#### Application Layer
```typescript
// ✅ BON : Service métier pur
export class MatchService {
  constructor(private repo: MatchRepository) {}

  async updateScore(id: number, home: number, away: number): Promise<Match> {
    // Validation métier
    if (home < 0 || away < 0) {
      throw new ValidationError("Scores cannot be negative");
    }
    
    // Appel repository
    return this.repo.update(id, { score_home: home, score_outside: away });
  }
}
```

#### Infrastructure Layer
```typescript
// ✅ BON : Repository pour l'accès aux données
export class MatchRepository {
  async update(id: number, data: Partial<Match>): Promise<Match> {
    return this.sql`UPDATE match SET ... WHERE id = ${id}`;
  }
}
```

#### Presentation Layer
```typescript
// ✅ BON : Routes sans logique métier
fastify.put("/api/matches/:id/score", async (request, reply) => {
  const { score_home, score_outside } = request.body;
  
  // Valider le format
  const parsed = updateScoreSchema.parse({ score_home, score_outside });
  
  // Appeler le service
  const match = await matchService.updateScore(id, parsed.score_home, parsed.score_outside);
  
  // Retourner la réponse
  return reply.send(match);
});
```

### Frontend

#### Domain
```typescript
// ✅ BON : Types métier purs
export interface Match {
  id_match: number;
  date: string;
  opponent: string;
  score_home: number;
  score_outside: number;
}
```

#### Application Layer - Services
```typescript
// ✅ BON : Service API sans logique React
export const matchService = {
  async getAll(): Promise<Match[]> {
    const response = await fetch(`${API_BASE}/matches`);
    if (!response.ok) throw new Error("Failed to fetch");
    return response.json();
  },
};
```

#### Application Layer - Hooks
```typescript
// ✅ BON : Hook React avec logique métier
export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    try {
      const data = await matchService.getAll();
      setMatches(data);
    } catch (err) {
      setError("Failed to load matches");
    }
  }, []);

  return { matches, error, fetchMatches };
}
```

#### Presentation Layer - Components
```typescript
// ✅ BON : Composant sans logique métier
export function MatchesList() {
  const { matches, error, fetchMatches } = useMatches();

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return (
    <Card>
      {matches.map(m => <MatchItem key={m.id_match} match={m} />)}
    </Card>
  );
}
```

---

## ❌ À ÉVITER

### Backend

#### ❌ Domain dépend de l'infrastructure
```typescript
// MAUVAIS : Domain ne doit pas connaître SQL
export interface Match {
  id_match: number;
  // ...
  sqlQuery?: string; // ❌ Pas de dépendance technique
}
```

#### ❌ Routes avec logique métier
```typescript
// MAUVAIS : La logique métier est dans la route
fastify.put("/api/matches/:id/score", async (request, reply) => {
  const { score_home, score_outside } = request.body;
  
  // ❌ Validation et logique ici !
  if (score_home < 0) {
    return reply.send({ error: "Invalid" });
  }
  
  // ❌ Appel direct à la base de données !
  await db.query(`UPDATE match SET ...`);
  
  return reply.send({ ok: true });
});
```

#### ❌ Repository retourne des entités métier modifiées
```typescript
// MAUVAIS : Le repository ne doit pas ajouter de logique
export class MatchRepository {
  async updateScore(id: number, home: number, away: number) {
    // ❌ Validation ici !
    if (home < 0) throw new Error("Invalid");
    
    return this.sql`...`;
  }
}
```

### Frontend

#### ❌ Composants avec appels API directs
```typescript
// MAUVAIS : Appel API dans le composant
function MatchesList() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    // ❌ Pas de logique API dans le composant !
    fetch("/api/matches")
      .then(r => r.json())
      .then(setMatches);
  }, []);

  return <div>{matches.map(m => ...)}</div>;
}
```

#### ❌ Logique métier dans les composants
```typescript
// MAUVAIS : Logique métier dans le composant
function MatchDetails({ match }) {
  const isFinished = new Date(match.date) < new Date(); // ❌ Logique métier !
  
  return <div>{isFinished ? "Finished" : "Scheduled"}</div>;
}
```

#### ❌ Composants trop gros
```typescript
// MAUVAIS : Composant qui fait tout
function Dashboard() {
  // 500 lignes de code...
  // Fetch, validation, transformation, rendu, etc.
}

// ✅ BON : Composants petits et focalisés
function Dashboard() {
  return (
    <DashboardLayout>
      <MatchesWidget />
      <TrainingsWidget />
      <CotisationsWidget />
    </DashboardLayout>
  );
}
```

---

## 🔍 Checklist avant chaque commit

- [ ] Domain ne contient pas de dépendances externes
- [ ] Services ne contiennent pas d'appels HTTP (frontend) ou Fastify (backend)
- [ ] Repositories ne contiennent pas de logique métier
- [ ] Routes n'exécutent que validation + appel service + réponse
- [ ] Composants React réutilisables et sans logique métier
- [ ] Chaque fichier a une seule responsabilité
- [ ] Les erreurs sont levées au bon endroit (domain/application, pas dans presentation)
- [ ] Les tests sont possibles sans dépendances externes

---

## 📖 Exemple complet : Créer un nouveau endpoint

### 1. Ajouter le type (Domain)
```typescript
// Back/src/domain/types.ts
export interface Event {
  id_event: number;
  title: string;
  date: string;
  id_team: number;
}
```

### 2. Créer le repository (Infrastructure)
```typescript
// Back/src/infrastructure/database/repository.ts
export class EventRepository {
  async create(data: Omit<Event, 'id_event'>): Promise<Event> {
    return this.sql`INSERT INTO event (...) VALUES (...) RETURNING *`;
  }
  
  async getAll(): Promise<Event[]> {
    return this.sql`SELECT * FROM event`;
  }
}
```

### 3. Créer le service (Application)
```typescript
// Back/src/application/EventService.ts
export class EventService {
  constructor(private repo: EventRepository) {}

  async create(data: Omit<Event, 'id_event'>): Promise<Event> {
    if (!data.title || !data.date) {
      throw new ValidationError("Title and date are required");
    }
    return this.repo.create(data);
  }
}
```

### 4. Créer les routes (Presentation)
```typescript
// Back/src/presentation/routes/event.routes.ts
export async function eventRoutes(fastify: FastifyInstance, eventRepo: EventRepository) {
  const eventService = new EventService(eventRepo);

  fastify.post("/api/events", async (request, reply) => {
    try {
      const event = await eventService.create(request.body);
      return reply.status(201).send(event);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });
}
```

### 5. Frontend - Ajouter le service API
```typescript
// src/application/services/api.ts
export const eventService = {
  async create(data: Omit<Event, 'id_event'>): Promise<Event> {
    const response = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};
```

### 6. Frontend - Ajouter le hook
```typescript
// src/application/hooks/index.ts
export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);

  const createEvent = useCallback(async (data: Omit<Event, 'id_event'>) => {
    const newEvent = await eventService.create(data);
    setEvents([...events, newEvent]);
    return newEvent;
  }, [events]);

  return { events, createEvent };
}
```

### 7. Frontend - Créer les composants
```typescript
// src/presentation/features/events/CreateEvent.tsx
export function CreateEvent() {
  const { createEvent, error } = useEvents();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEvent(formData);
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## 🎓 Ressources d'apprentissage

- [Robert C. Martin - Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://en.wikipedia.org/wiki/Domain-driven_design)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

