import postgres = require("postgres");
import * as argon2 from "argon2";

process.loadEnvFile();

const sql = postgres({
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT) || 5432,
  user: process.env.PGUSER || "toto",
  password: process.env.PGPASSWORD || "example",
  database: process.env.PGDATABASE || "projet_club_db",
});

export class Repository {
  sql: postgres.Sql;

  constructor() {
    this.sql = sql;
  }

  async registerPlayer({
  surname,
  name,
  mail,
  phone,
  password,
}: {
  surname: string;
  name: string;
  mail: string;
  phone: string | null;
  password: string;
}) {
    const existing = await this.sql`
      SELECT * FROM player WHERE mail = ${mail}
    `;

    if (existing.length > 0) {
      throw new Error("Un compte existe déjà avec cet email.");
    }
    const hash = await argon2.hash(password);
    const phoneValue = phone ?? null;
    const result = await this.sql`
      INSERT INTO player (surname, name, mail, phone, password, status)
      VALUES (${surname}, ${name}, ${mail}, ${phoneValue}, ${hash}, 'Actif')
      RETURNING id_player, surname, name, mail
    `;

    return result[0];
  }
  async loginPlayer(mail: string, password: string) {
    const user = await this.sql`
      SELECT * FROM player WHERE mail = ${mail}
    `;

    if (user.length === 0) {
      throw new Error("Email ou mot de passe incorrect.");
    }

    const player = user[0];

    const isValid = await argon2.verify(player.password, password);

    if (!isValid) {
      throw new Error("Email ou mot de passe incorrect.");
    }

    const { mot_de_passe: _, ...safeUser } = player;
    return safeUser;
  }
  async getPlayerByEmail(mail: string) {
    const user = await this.sql`
      SELECT id_player, surname, name, mail, position, number, phone, status
      FROM player WHERE mail = ${mail}
    `;
    return user[0] || null;
  }

  async getPlayerById(id_player: number) {
    const user = await this.sql`
      SELECT id_player, surname, name, mail, position, number, phone, status
      FROM player WHERE id_player = ${id_player}
    `;
    return user[0] || null;
  }
   async saveRefreshToken({
  userId,
  token,
  expiresAt,
}: {
  userId: number;
  token: string;
  expiresAt: Date;
}) {
  return await this.sql`
    INSERT INTO refresh_tokens (user_id, token, expires_at)
    VALUES (${userId}, ${token}, ${expiresAt})
    RETURNING id, user_id, token, expires_at
  `;
}

  async findRefreshToken(token: string) {
  const result = await this.sql`
    SELECT * FROM refresh_tokens
    WHERE token = ${token}
    LIMIT 1
  `;
  return result[0] || null;
}

  async revokeRefreshToken(token: string) {
  return await this.sql`
    UPDATE refresh_tokens
    SET revoked = TRUE
    WHERE token = ${token}
  `;
}
async revokeAllUserTokens(userId: number) {
  return await this.sql`
    UPDATE refresh_tokens
    SET revoked = TRUE
    WHERE user_id = ${userId}
  `;
}
  async createTrainingSession({
  date,
  hour,
  location,
  type,
  team,
}: {
  date: Date;
  hour: string;
  location: string;
  type: string;
  team: string;
}) {
  const result = await this.sql`
    INSERT INTO training (date, hour, type, location, team)
    VALUES (${date}, ${hour}, ${type}, ${location}, ${team})
    RETURNING id_training
  `;
  return result[0];
}

  async modifyTrainingSession({
  id_training,
  date,
  hour,
  location,
  type,
  team,
}: {
  id_training: number;
  date: Date;
  hour: string;
  location: string;
  type: string;
  team: string;
}) {
  const result = await this.sql`
    UPDATE training
    SET date = ${date}, hour = ${hour}, type = ${type}, location = ${location}, team = ${team}
    WHERE id_training = ${id_training}
    RETURNING id_training
  `;
  return result[0];
}

  async deleteTrainingSession(id_training: number) {
    await this.sql`
      DELETE FROM training
      WHERE id_training = ${id_training}
    `;
  }
  async listTrainingSessions() {
    const result = await this.sql`
      SELECT * FROM training
    `;    
    return result;
  }
  async createMatchSession({
  date,
  hour,
  opponent,
  location,
  type,
  team,
  score_home,
  score_outside,
}: {
  date: Date;
  hour: string;
  opponent: string;
  location: string;
  type: string;
  team: string;
  score_home: number;
  score_outside: number;
}) {
  const result = await this.sql`
    INSERT INTO match (date, hour, opponent, location, type, team, score_home, score_outside)
    VALUES (${date}, ${hour}, ${opponent}, ${location}, ${type}, ${team}, ${score_home}, ${score_outside})
    RETURNING id_match
  `;
  return result[0];
}
async modifyMatchSession({
  id_match,
  date,
  hour,
  opponent,
  location,
  type,
  team,
  score_home,
  score_outside,
}: {
  id_match: number;
  date: Date;
  hour: string;
  opponent: string;
  location: string;
  type: string;
  team: string;
  score_home: number;
  score_outside: number;
}) {
  const result = await this.sql`
    UPDATE match
    SET date = ${date}, hour = ${hour}, opponent = ${opponent}, location = ${location}, type = ${type}, team = ${team}, score_home = ${score_home}, score_outside = ${score_outside}
    WHERE id_match = ${id_match}
    RETURNING id_match
  `;
  return result[0]; 
}
async deleteMatchSession(id_match: number) {
    await this.sql`
      DELETE FROM match
      WHERE id_match = ${id_match}
    `;
  }
async listMatchSessions() {
    const result = await this.sql`
      SELECT * FROM match
    `;    
    return result;
}
}

