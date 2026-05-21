import type { Player, Coach } from "../../domain/types";
import type { PlayerRepository, CoachRepository } from "../../infrastructure/database/repository";
import { ValidationError, UnauthorizedError } from "../../shared/errors";

export class AuthService {
  constructor(
    private playerRepository: PlayerRepository,
    private coachRepository: CoachRepository
  ) {}

  async loginPlayer(mail: string, _password: string): Promise<Player> {
    const player = await this.playerRepository.findByMail(mail);
    if (!player) {
      throw new UnauthorizedError("Email ou mot de passe incorrect.");
    }

    // À implémenter: vérification du mot de passe avec argon2
    // const isPasswordValid = await argon2.verify(player.password, password);
    // if (!isPasswordValid) {
    //   throw new UnauthorizedError("Email ou mot de passe incorrect.");
    // }

    return player;
  }

  async loginCoach(mail: string, _password: string): Promise<Coach> {
    const coach = await this.coachRepository.findByMail(mail);
    if (!coach) {
      throw new UnauthorizedError("Email ou mot de passe incorrect.");
    }

    // À implémenter: vérification du mot de passe avec argon2
    return coach;
  }

  async registerPlayer(data: {
    surname: string;
    name: string;
    mail: string;
    phone: string | null;
    password: string;
  }): Promise<Player> {
    if (!data.mail || !data.password) {
      throw new ValidationError("Email et mot de passe sont requis");
    }

    return this.playerRepository.create({
      surname: data.surname,
      name: data.name,
      mail: data.mail,
      phone: data.phone,
      status: 'Actif',
    });
  }

  async registerCoach(data: {
    surname: string;
    name: string;
    mail: string;
    phone: string | null;
    password: string;
  }): Promise<Coach> {
    if (!data.mail || !data.password) {
      throw new ValidationError("Email et mot de passe sont requis");
    }

    return this.coachRepository.create({
      surname: data.surname,
      name: data.name,
      mail: data.mail,
      phone: data.phone,
    });
  }
}
