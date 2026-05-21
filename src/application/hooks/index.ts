// Hooks personnalisés pour le frontend
import { useState, useCallback } from 'react';
import type { Match, Training, Cotisation } from '../../domain/models';
import * as apiServices from './api';

// Hook pour gérer les matchs
export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiServices.matchService.getAll();
      setMatches(data);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Erreur lors du chargement des matchs');
    } finally {
      setLoading(false);
    }
  }, []);

  const createMatch = useCallback(async (data: Omit<Match, 'id_match'>) => {
    try {
      const newMatch = await apiServices.matchService.create(data);
      setMatches([...matches, newMatch]);
      return newMatch;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw err;
    }
  }, [matches]);

  const updateMatchScore = useCallback(async (id: number, score_home: number, score_outside: number) => {
    try {
      const updated = await apiServices.matchService.updateScore(id, score_home, score_outside);
      setMatches(matches.map(m => m.id_match === id ? updated : m));
      return updated;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw err;
    }
  }, [matches]);

  const deleteMatch = useCallback(async (id: number) => {
    try {
      await apiServices.matchService.delete(id);
      setMatches(matches.filter(m => m.id_match !== id));
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw err;
    }
  }, [matches]);

  return { matches, loading, error, fetchMatches, createMatch, updateMatchScore, deleteMatch };
}

// Hook pour gérer les entraînements
export function useTrainings() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrainings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiServices.trainingService.getAll();
      setTrainings(data);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Erreur lors du chargement des entraînements');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTraining = useCallback(async (data: Omit<Training, 'id_training'>) => {
    try {
      const newTraining = await apiServices.trainingService.create(data);
      setTrainings([...trainings, newTraining]);
      return newTraining;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw err;
    }
  }, [trainings]);

  const updateTraining = useCallback(async (id: number, data: Partial<Training>) => {
    try {
      const updated = await apiServices.trainingService.update(id, data);
      setTrainings(trainings.map(t => t.id_training === id ? updated : t));
      return updated;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw err;
    }
  }, [trainings]);

  const deleteTraining = useCallback(async (id: number) => {
    try {
      await apiServices.trainingService.delete(id);
      setTrainings(trainings.filter(t => t.id_training !== id));
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw err;
    }
  }, [trainings]);

  return { trainings, loading, error, fetchTrainings, createTraining, updateTraining, deleteTraining };
}

// Hook pour gérer les cotisations
export function useCotisations() {
  const [cotisations, setCotisations] = useState<Cotisation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCotisations = useCallback(async (id_player?: number) => {
    setLoading(true);
    setError(null);
    try {
      let data: Cotisation[];
      if (id_player) {
        data = await apiServices.cotisationService.getByPlayer(id_player);
      } else {
        data = await apiServices.cotisationService.getAll();
      }
      setCotisations(data);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Erreur lors du chargement des cotisations');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCotisation = useCallback(async (data: Omit<Cotisation, 'id_cotisation'>) => {
    try {
      const newCotisation = await apiServices.cotisationService.create(data);
      setCotisations([...cotisations, newCotisation]);
      return newCotisation;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw err;
    }
  }, [cotisations]);

  const updateCotisationStatus = useCallback(async (id: number, status: 'Pending' | 'Paid' | 'Overdue') => {
    try {
      const updated = await apiServices.cotisationService.updateStatus(id, status);
      setCotisations(cotisations.map(c => c.id_cotisation === id ? updated : c));
      return updated;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw err;
    }
  }, [cotisations]);

  const deleteCotisation = useCallback(async (id: number) => {
    try {
      await apiServices.cotisationService.delete(id);
      setCotisations(cotisations.filter(c => c.id_cotisation !== id));
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw err;
    }
  }, [cotisations]);

  return { cotisations, loading, error, fetchCotisations, createCotisation, updateCotisationStatus, deleteCotisation };
}

// Hook pour gérer l'authentification
export function useAuth() {
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (mail: string, password: string, userType: 'player' | 'coach') => {
    setLoading(true);
    setError(null);
    try {
      const userData = await apiServices.authService.login(mail, password, userType);
      setUser(userData);
      return userData;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: Record<string, unknown>, userType: 'player' | 'coach') => {
    setLoading(true);
    setError(null);
    try {
      const userData = await apiServices.authService.register(data, userType);
      setUser(userData);
      return userData;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiServices.authService.logout();
      setUser(null);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  }, []);

  return { user, loading, error, login, register, logout };
}
