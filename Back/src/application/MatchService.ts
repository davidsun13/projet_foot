import type { Match } from "../../domain/types";
import { MatchRepository } from "../../infrastructure/database/repository";
import { NotFoundError, ValidationError } from "../../shared/errors";

export class MatchService {
  constructor(private matchRepository: MatchRepository) {}

  async getAll(): Promise<Match[]> {
    return this.matchRepository.findAll();
  }

  async getById(id: number): Promise<Match> {
    const match = await this.matchRepository.findById(id);
    if (!match) {
      throw new NotFoundError("Match non trouvé");
    }
    return match;
  }

  async getByTeam(id_team: number): Promise<Match[]> {
    return this.matchRepository.findByTeam(id_team);
  }

  async create(data: Omit<Match, 'id_match'>): Promise<Match> {
    // Validation
    if (!data.date || !data.opponent) {
      throw new ValidationError("Les champs requis sont manquants");
    }

    return this.matchRepository.create(data);
  }

  async updateScore(id: number, score_home: number, score_outside: number): Promise<Match> {
    const match = await this.getById(id);

    if (score_home < 0 || score_outside < 0) {
      throw new ValidationError("Les scores ne peuvent pas être négatifs");
    }

    return this.matchRepository.update(id, {
      ...match,
      score_home,
      score_outside,
    });
  }

  async delete(id: number): Promise<void> {
    await this.getById(id); // Vérifie que le match existe
    await this.matchRepository.delete(id);
  }
}
