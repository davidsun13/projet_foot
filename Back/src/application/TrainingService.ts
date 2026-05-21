import type { Training } from "../../domain/types";
import { TrainingRepository } from "../../infrastructure/database/repository";
import { NotFoundError, ValidationError } from "../../shared/errors";

export class TrainingService {
  constructor(private trainingRepository: TrainingRepository) {}

  async getAll(): Promise<Training[]> {
    return this.trainingRepository.findAll();
  }

  async getById(id: number): Promise<Training> {
    const training = await this.trainingRepository.findById(id);
    if (!training) {
      throw new NotFoundError("Entraînement non trouvé");
    }
    return training;
  }

  async getByTeam(id_team: number): Promise<Training[]> {
    return this.trainingRepository.findByTeam(id_team);
  }

  async create(data: Omit<Training, 'id_training'>): Promise<Training> {
    if (!data.date || !data.location) {
      throw new ValidationError("Les champs requis sont manquants");
    }

    return this.trainingRepository.create(data);
  }

  async update(id: number, data: Partial<Training>): Promise<Training> {
    await this.getById(id); // Vérifie que l'entraînement existe
    return this.trainingRepository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.trainingRepository.delete(id);
  }
}
