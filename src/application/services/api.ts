// Services API pour communiquer avec le backend

import type { Player, Match, Training, Cotisation } from '../domain/models';

const API_BASE = 'http://localhost:1234/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Une erreur est survenue' }));
    throw new ApiError(response.status, error.message || 'Une erreur est survenue');
  }
  return response.json();
}

// Auth Service
export const authService = {
  async login(mail: string, password: string, userType: 'player' | 'coach') {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mail, password, userType }),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async register(data: any, userType: 'player' | 'coach') {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, userType }),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async logout() {
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return handleResponse(response);
  },
};

// Player Service
export const playerService = {
  async getAll(): Promise<Player[]> {
    const response = await fetch(`${API_BASE}/players`, {
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async getById(id: number): Promise<Player> {
    const response = await fetch(`${API_BASE}/players/${id}`, {
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async update(id: number, data: Partial<Player>): Promise<Player> {
    const response = await fetch(`${API_BASE}/players/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/players/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    await handleResponse(response);
  },
};

// Match Service
export const matchService = {
  async getAll(): Promise<Match[]> {
    const response = await fetch(`${API_BASE}/matches`, {
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async getById(id: number): Promise<Match> {
    const response = await fetch(`${API_BASE}/matches/${id}`, {
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async create(data: Omit<Match, 'id_match'>): Promise<Match> {
    const response = await fetch(`${API_BASE}/matches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async updateScore(id: number, score_home: number, score_outside: number): Promise<Match> {
    const response = await fetch(`${API_BASE}/matches/${id}/score`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score_home, score_outside }),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/matches/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    await handleResponse(response);
  },
};

// Training Service
export const trainingService = {
  async getAll(): Promise<Training[]> {
    const response = await fetch(`${API_BASE}/trainings`, {
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async getById(id: number): Promise<Training> {
    const response = await fetch(`${API_BASE}/trainings/${id}`, {
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async create(data: Omit<Training, 'id_training'>): Promise<Training> {
    const response = await fetch(`${API_BASE}/trainings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async update(id: number, data: Partial<Training>): Promise<Training> {
    const response = await fetch(`${API_BASE}/trainings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/trainings/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    await handleResponse(response);
  },
};

// Cotisation Service
export const cotisationService = {
  async getAll(): Promise<Cotisation[]> {
    const response = await fetch(`${API_BASE}/cotisations`, {
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async getById(id: number): Promise<Cotisation> {
    const response = await fetch(`${API_BASE}/cotisations/${id}`, {
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async getByPlayer(id_player: number): Promise<Cotisation[]> {
    const response = await fetch(`${API_BASE}/cotisations/player/${id_player}`, {
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async create(data: Omit<Cotisation, 'id_cotisation'>): Promise<Cotisation> {
    const response = await fetch(`${API_BASE}/cotisations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async updateStatus(id: number, status: 'Pending' | 'Paid' | 'Overdue'): Promise<Cotisation> {
    const response = await fetch(`${API_BASE}/cotisations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/cotisations/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    await handleResponse(response);
  },
};
