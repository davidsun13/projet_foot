import postgres from "postgres";
import * as argon2 from "argon2";
import type { Player, Coach, Match, Training, Cotisation } from "../../domain/types";
import { ConflictError, NotFoundError } from "../../shared/errors";

process.loadEnvFile();

const sql = postgres({
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT) || 5432,
  user: process.env.PGUSER || "toto",
  password: process.env.PGPASSWORD || "example",
  database: process.env.PGDATABASE || "projet_club_db",
});

export class PlayerRepository {
  constructor(private sqlClient: postgres.Sql = sql) {}

  async findByMail(mail: string): Promise<Player | null> {
    const result = await this.sqlClient`
      SELECT * FROM player WHERE mail = ${mail}
    `;
    return result[0] || null;
  }

  async findById(id: number): Promise<Player | null> {
    const result = await this.sqlClient`
      SELECT * FROM player WHERE id_player = ${id}
    `;
    return result[0] || null;
  }

  async findAll(): Promise<Player[]> {
    return this.sqlClient`SELECT * FROM player`;
  }

  async create(data: Omit<Player, 'id_player'>): Promise<Player> {
    const existing = await this.findByMail(data.mail);
    if (existing) {
      throw new ConflictError("Un compte existe déjà avec cet email.");
    }

    const hash = await argon2.hash("");
    const result = await this.sqlClient`
      INSERT INTO player (surname, name, mail, phone, password, status)
      VALUES (${data.surname}, ${data.name}, ${data.mail}, ${data.phone || null}, ${hash}, 'Actif')
      RETURNING id_player, surname, name, mail, phone, status
    `;

    return result[0];
  }

  async updatePassword(id: number, password: string): Promise<void> {
    const hash = await argon2.hash(password);
    await this.sqlClient`
      UPDATE player SET password = ${hash} WHERE id_player = ${id}
    `;
  }

  async delete(id: number): Promise<void> {
    await this.sqlClient`
      DELETE FROM player WHERE id_player = ${id}
    `;
  }
}

export class CoachRepository {
  constructor(private sqlClient: postgres.Sql = sql) {}

  async findByMail(mail: string): Promise<Coach | null> {
    const result = await this.sqlClient`
      SELECT * FROM coach WHERE mail = ${mail}
    `;
    return result[0] || null;
  }

  async findById(id: number): Promise<Coach | null> {
    const result = await this.sqlClient`
      SELECT * FROM coach WHERE id_coach = ${id}
    `;
    return result[0] || null;
  }

  async findAll(): Promise<Coach[]> {
    return this.sqlClient`SELECT * FROM coach`;
  }

  async create(data: Omit<Coach, 'id_coach'>): Promise<Coach> {
    const existing = await this.findByMail(data.mail);
    if (existing) {
      throw new ConflictError("Un compte existe déjà avec cet email.");
    }

    const hash = await argon2.hash("");
    const result = await this.sqlClient`
      INSERT INTO coach (surname, name, mail, phone, password)
      VALUES (${data.surname}, ${data.name}, ${data.mail}, ${data.phone || null}, ${hash})
      RETURNING id_coach, surname, name, mail, phone
    `;

    return result[0];
  }

  async updatePassword(id: number, password: string): Promise<void> {
    const hash = await argon2.hash(password);
    await this.sqlClient`
      UPDATE coach SET password = ${hash} WHERE id_coach = ${id}
    `;
  }

  async delete(id: number): Promise<void> {
    await this.sqlClient`
      DELETE FROM coach WHERE id_coach = ${id}
    `;
  }
}

export class MatchRepository {
  constructor(private sqlClient: postgres.Sql = sql) {}

  async findById(id: number): Promise<Match | null> {
    const result = await this.sqlClient`
      SELECT * FROM match WHERE id_match = ${id}
    `;
    return result[0] || null;
  }

  async findByTeam(id_team: number): Promise<Match[]> {
    return this.sqlClient`
      SELECT * FROM match WHERE id_team = ${id_team} ORDER BY date DESC
    `;
  }

  async findAll(): Promise<Match[]> {
    return this.sqlClient`SELECT * FROM match ORDER BY date DESC`;
  }

  async create(data: Omit<Match, 'id_match'>): Promise<Match> {
    const result = await this.sqlClient`
      INSERT INTO match (date, hour, opponent, location, type, id_team, id_coach, score_home, score_outside)
      VALUES (${data.date}, ${data.hour}, ${data.opponent}, ${data.location}, ${data.type}, ${data.id_team}, ${data.id_coach || null}, ${data.score_home}, ${data.score_outside})
      RETURNING *
    `;

    return result[0];
  }

  async update(id: number, data: Partial<Match>): Promise<Match> {
    const match = await this.findById(id);
    if (!match) {
      throw new NotFoundError("Match non trouvé");
    }

    const result = await this.sqlClient`
      UPDATE match SET 
        score_home = ${data.score_home ?? match.score_home},
        score_outside = ${data.score_outside ?? match.score_outside}
      WHERE id_match = ${id}
      RETURNING *
    `;

    return result[0];
  }

  async delete(id: number): Promise<void> {
    await this.sqlClient`
      DELETE FROM match WHERE id_match = ${id}
    `;
  }
}

export class TrainingRepository {
  constructor(private sqlClient: postgres.Sql = sql) {}

  async findById(id: number): Promise<Training | null> {
    const result = await this.sqlClient`
      SELECT * FROM training WHERE id_training = ${id}
    `;
    return result[0] || null;
  }

  async findByTeam(id_team: number): Promise<Training[]> {
    return this.sqlClient`
      SELECT * FROM training WHERE id_team = ${id_team} ORDER BY date DESC
    `;
  }

  async findAll(): Promise<Training[]> {
    return this.sqlClient`SELECT * FROM training ORDER BY date DESC`;
  }

  async create(data: Omit<Training, 'id_training'>): Promise<Training> {
    const result = await this.sqlClient`
      INSERT INTO training (date, hour, location, type, id_team, id_coach, description)
      VALUES (${data.date}, ${data.hour}, ${data.location}, ${data.type}, ${data.id_team}, ${data.id_coach || null}, ${data.description || null})
      RETURNING *
    `;

    return result[0];
  }

  async update(id: number, data: Partial<Training>): Promise<Training> {
    const training = await this.findById(id);
    if (!training) {
      throw new NotFoundError("Entraînement non trouvé");
    }

    const result = await this.sqlClient`
      UPDATE training SET 
        date = ${data.date ?? training.date},
        hour = ${data.hour ?? training.hour},
        location = ${data.location ?? training.location},
        type = ${data.type ?? training.type},
        description = ${data.description ?? training.description}
      WHERE id_training = ${id}
      RETURNING *
    `;

    return result[0];
  }

  async delete(id: number): Promise<void> {
    await this.sqlClient`
      DELETE FROM training WHERE id_training = ${id}
    `;
  }
}

export class CotisationRepository {
  constructor(private sqlClient: postgres.Sql = sql) {}

  async findById(id: number): Promise<Cotisation | null> {
    const result = await this.sqlClient`
      SELECT * FROM cotisation WHERE id_cotisation = ${id}
    `;
    return result[0] || null;
  }

  async findByPlayer(id_player: number): Promise<Cotisation[]> {
    return this.sqlClient`
      SELECT * FROM cotisation WHERE id_player = ${id_player} ORDER BY created_at DESC
    `;
  }

  async findAll(): Promise<Cotisation[]> {
    return this.sqlClient`SELECT * FROM cotisation`;
  }

  async create(data: Omit<Cotisation, 'id_cotisation'>): Promise<Cotisation> {
    const result = await this.sqlClient`
      INSERT INTO cotisation (amount, date_payment, id_player, status)
      VALUES (${data.amount}, ${data.date_payment || null}, ${data.id_player}, ${data.status || 'Pending'})
      RETURNING *
    `;

    return result[0];
  }

  async update(id: number, data: Partial<Cotisation>): Promise<Cotisation> {
    const cotisation = await this.findById(id);
    if (!cotisation) {
      throw new NotFoundError("Cotisation non trouvée");
    }

    const result = await this.sqlClient`
      UPDATE cotisation SET 
        amount = ${data.amount ?? cotisation.amount},
        date_payment = ${data.date_payment ?? cotisation.date_payment},
        status = ${data.status ?? cotisation.status}
      WHERE id_cotisation = ${id}
      RETURNING *
    `;

    return result[0];
  }

  async delete(id: number): Promise<void> {
    await this.sqlClient`
      DELETE FROM cotisation WHERE id_cotisation = ${id}
    `;
  }
}
