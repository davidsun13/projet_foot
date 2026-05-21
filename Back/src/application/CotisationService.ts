import type { Cotisation } from "../../domain/types";
import { CotisationRepository } from "../../infrastructure/database/repository";
import { NotFoundError, ValidationError } from "../../shared/errors";

export class CotisationService {
  constructor(private cotisationRepository: CotisationRepository) {}

  async getAll(): Promise<Cotisation[]> {
    return this.cotisationRepository.findAll();
  }

  async getById(id: number): Promise<Cotisation> {
    const cotisation = await this.cotisationRepository.findById(id);
    if (!cotisation) {
      throw new NotFoundError("Cotisation non trouvée");
    }
    return cotisation;
  }

  async getByPlayer(id_player: number): Promise<Cotisation[]> {
    return this.cotisationRepository.findByPlayer(id_player);
  }

  async create(data: Omit<Cotisation, 'id_cotisation'>): Promise<Cotisation> {
    if (data.amount <= 0) {
      throw new ValidationError("Le montant doit être positif");
    }

    return this.cotisationRepository.create(data);
  }

  async updatePaymentStatus(id: number, status: 'Pending' | 'Paid' | 'Overdue'): Promise<Cotisation> {
    await this.getById(id);
    return this.cotisationRepository.update(id, { status });
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.cotisationRepository.delete(id);
  }
}
