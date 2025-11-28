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
    phone: string;
    password: string;
  }) {
    const existing = await this.sql`
      SELECT * FROM player WHERE mail = ${mail}
    `;

    if (existing.length > 0) {
      throw new Error("Un compte existe déjà avec cet email.");
    }
    const hash = await argon2.hash(password);

    const result = await this.sql`
      INSERT INTO player (surname, name, mail, phone, password, status)
      VALUES (${surname}, ${name}, ${mail}, ${phone}, ${hash}, 'Actif')
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
      SELECT id_playr, surname, name, mail, position, number, phone, status
      FROM player WHERE id_player = ${id_player}
    `;
    return user[0] || null;
  }
}
