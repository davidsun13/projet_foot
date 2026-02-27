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
    VALUES (
      ${surname},
      ${name},
      ${mail},
      ${phoneValue},
      ${hash},
      'Actif'
    )
    RETURNING id_player, surname, name, mail
  `;

    // 5️⃣ Retourner le joueur
    return result[0];
  }


  async registerCoach({
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
      SELECT * FROM coach WHERE mail = ${mail}
    `;

    if (existing.length > 0) {
      throw new Error("Un compte existe déjà avec cet email.");
    }
    const hash = await argon2.hash(password);
    const phoneValue = phone ?? null;
    const result = await this.sql`
      INSERT INTO coach (surname, name, mail, phone, password)
      VALUES (${surname}, ${name}, ${mail}, ${phoneValue}, ${hash})
      RETURNING id_coach, surname, name, mail, phone
    `;

    return result[0];
  }
  async loginCoach(mail: string, password: string) {
    const user = await this.sql`
    SELECT * FROM coach WHERE mail = ${mail}
  `;

    if (user.length === 0) {
      throw new Error("Email ou mot de passe incorrect.");
    }

    const coach = user[0];

    const isValid = await argon2.verify(coach.password, password);

    if (!isValid) {
      throw new Error("Email ou mot de passe incorrect.");
    }

    delete coach.password;

    return coach;
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

    delete player.password;

    return player;
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
  async getCoachbyEmail(mail: string) {
    const user = await this.sql`
      SELECT id_coach, surname, name, mail, phone
      FROM coach WHERE mail = ${mail}
    `;
    return user[0] || null;
  }
  async getCoachById(id_coach: number) {
    const user = await this.sql`
      SELECT id_coach, surname, name, mail, phone
      FROM coach WHERE id_coach = ${id_coach}
    `;
    return user[0] || null;
  }
  async saveRefreshToken({
    userId,
    userType,
    token,
    expiresAt,
  }: {
    userId: number;
    userType: 'player' | 'coach';
    token: string;
    expiresAt: Date;
  }) {
    const column = userType === 'player' ? 'player_id' : 'coach_id';

    const result = await this.sql`
    INSERT INTO refresh_tokens (${this.sql(column)}, token, expires_at)
    VALUES (${userId}, ${token}, ${expiresAt})
    RETURNING id, player_id, coach_id, token, expires_at
  `;

    return result[0];
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

  async revokeAllUserTokens(userId: number, userType: 'player' | 'coach') {
    const column = userType === 'player' ? 'player_id' : 'coach_id';

    return await this.sql`
    UPDATE refresh_tokens
    SET revoked = TRUE
    WHERE ${this.sql(column)} = ${userId}
  `;
  }
  async createTrainingSession({
    date,
    hour,
    location,
    type,
    id_team,
    id_coach,
  }: {
    date: string;
    hour: string;
    location: string;
    type: string;
    id_team: number;
    id_coach: number | null;
  }) {

    const [training] = await this.sql`
    INSERT INTO training (date, hour, type, location, id_team,id_coach)
    VALUES (
      ${new Date(date)},
      ${hour},
      ${type},
      ${location},
      ${id_team},
      ${id_coach}
    )
    RETURNING id_training
  `;
    const players = await this.sql`
    SELECT id_player
    FROM player
    WHERE id_team = ${id_team} AND status = 'Actif'
  `;
    for (const player of players) {
      await this.sql`
      INSERT INTO convocation (id_player, id_training, status)
      VALUES (${player.id_player}, ${training.id_training}, 'Waiting')
    `;
    }
    return training;
  }

  async getTrainingById(id_training: number) {
    const result = await this.sql`
      SELECT * FROM training WHERE id_training = ${id_training}
    `;
    return result[0] || null;
  }
  async getConvocationsTrainingbyplayer(id_player: number) {
    const result = await this.sql`
    SELECT
  c.id_convocation,
  c.status,
  t.date,
  t.hour,
  t.type,
  t.location,
  tm.name AS team_name
FROM convocation c
JOIN training t ON c.id_training = t.id_training
JOIN team tm ON t.id_team = tm.id_team
WHERE c.id_player = ${id_player}
ORDER BY t.date DESC, tm.name;
  `;
    return result;
  }
  async getConvocationsMatchbyplayer(id_player: number) {
    const result = await this.sql`
    SELECT
  c.id_convocation,
  c.status,
  m.date,
  m.hour,
  m.type,
  m.location,
  tm.name AS team_name,
  m.opponent
FROM convocation c
JOIN matches m ON c.id_match = m.id_match 
JOIN team tm ON m.id_team = tm.id_team
WHERE c.id_player = ${id_player}
ORDER BY m.date DESC, tm.name;
  `;
    return result;
  }
  
  async getConvocationsByTraining(id_training: number) {
    const result = await this.sql`
    SELECT c.*, p.name AS player_name, p.surname AS player_surname
    FROM convocation c
    JOIN player p ON c.id_player = p.id_player
    WHERE c.id_training = ${id_training}
  `;
    return result;
  }
  async getConvocationsByMatch(id_match: number) {
    const result = await this.sql`
    SELECT c.*, p.name AS player_name, p.surname AS player_surname
    FROM convocation c
    JOIN player p ON c.id_player = p.id_player
    WHERE c.id_match = ${id_match}
  `;
    return result;
  }

  async modifyTrainingSession({
    id_training,
    date,
    hour,
    location,
    type,
    id_team,
    id_coach
  }: {
    id_training: number;
    date: Date;
    hour: string;
    location: string;
    type: string;
    id_team: number;
    id_coach: number | null;
  }) {
    const result = await this.sql`
    UPDATE training
    SET date = ${date}, hour = ${hour}, type = ${type}, location = ${location}, id_team = ${id_team}, id_coach = ${id_coach}
    WHERE id_training = ${id_training}
    RETURNING id_training
  `;
    return result[0];
  }

  async deleteTrainingSession(id_training: number) {
    await this.sql`
      DELETE FROM training
      WHERE id_training = ${id_training}

      DELETE FROM convocation
      WHERE id_training = ${id_training}
    `;
  }
  async getAllTrainings() {
    const result = await this.sql`
    SELECT
      tr.id_training,
      tr.date,
      tr.hour,
      tr.type,
      tr.location,
      t.name AS team_name,
      tr.id_team,
      tr.id_coach
    FROM training tr
    LEFT JOIN team t ON tr.id_team = t.id_team
    ORDER BY tr.date DESC, t.name;
  `;
    return result;
  }
  async createMatchSession({
    date,
    hour,
    opponent,
    location,
    type,
    id_team,
    id_coach,
    score_home = null,
    score_outside = null,
  }: {
    date: Date;
    hour: string;
    opponent: string;
    location: string;
    type: string;
    id_team: number;
    id_coach: number | null;
    score_home?: number | null;
    score_outside?: number | null;
  }) {
    const [match] = await this.sql`
    INSERT INTO matches (
      date, hour, opponent, location, type,
      id_team,id_coach, score_home, score_outside
    )
    VALUES (
      ${date}, ${hour}, ${opponent}, ${location}, ${type},
      ${id_team},${id_coach}, ${score_home}, ${score_outside}
    )
    RETURNING id_match
  `;
    const players = await this.sql`
    SELECT id_player
    FROM player
    WHERE id_team = ${id_team} AND status = 'Actif'
  `;
    for (const player of players) {
      await this.sql`
      INSERT INTO convocation (id_player, id_match, status)
      VALUES (${player.id_player}, ${match.id_match}, 'Waiting')
    `;
    }
    return match;
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
    UPDATE matches
    SET date = ${date}, hour = ${hour}, opponent = ${opponent}, location = ${location}, type = ${type}, team = ${team}, score_home = ${score_home}, score_outside = ${score_outside}
    WHERE id_match = ${id_match}
    RETURNING id_match
  `;
    return result[0];
  }
  async deleteMatchSession(id_match: number) {
    await this.sql`
      DELETE FROM matches
      WHERE id_match = ${id_match}

      DELETE FROM convocation
      WHERE id_match = ${id_match}
    `;
  }
  async listMatchSessions() {
    const result = await this.sql`
      SELECT * FROM matches NATURAL JOIN team
    `;
    return result;
  }

  async updateMatchScore({
    id_match,
    score_home,
    score_outside,
  }: {
    id_match: number;
    score_home: number;
    score_outside: number;
  }) {
    const result = await this.sql`
    UPDATE matches
    SET score_home = ${score_home},
        score_outside = ${score_outside}
    WHERE id_match = ${id_match}
    RETURNING *
  `;
    return result[0];
  }
  async createTeam({
    name,
    category,
    season,
  }: {
    name: string;
    category: string;
    season: string;
  }) {
    const result = await this.sql`
    INSERT INTO team (name, category, season)
    VALUES (${name}, ${category}, ${season})
    RETURNING id_team
  `;
    return result[0];
  }
  async listTeams() {
    const result = await this.sql`
      SELECT * FROM team
    `;
    return result;
  }
  async modifyTeam({
    id_team,
    name,
    category,
    season,
  }: {
    id_team: number;
    name: string;
    category: string;
    season: string;
  }) {
    const result = await this.sql`
    UPDATE team
    SET name = ${name}, category = ${category}, season = ${season}
    WHERE id_team = ${id_team}
    RETURNING id_team
  `;
    return result[0];
  }
  async deleteTeam(id_team: number) {
    await this.sql`
      DELETE FROM team
      WHERE id_team = ${id_team}
    `;
  }
  async getallPlayers() {
    const result = await this.sql`
            SELECT
          p.id_player,
          p.name,
          p.surname,
          p.position,
          p.number,
          p.status,
          t.name AS team_name
      FROM player p
      LEFT JOIN team t ON p.id_team = t.id_team
      ORDER BY t.name, p.surname;
          `;
    return result;
  }
  async getplayerbyid(id_player: number) {
    const result = await this.sql`
      SELECT id_player, surname, name, mail, position, number, phone, status,id_team
      FROM player WHERE id_player = ${id_player}
    `;
    return result[0] || null;
  }
  async updatePlayer({
    id_player,
    surname,
    name,
    position,
    number,
    status,
    id_team,
  }: {
    id_player: number;
    surname: string;
    name: string;
    position: string;
    number: number;
    status: string;
    id_team: number | null;
  }) {
    const result = await this.sql`
    UPDATE player
    SET
      surname = ${surname},
      name = ${name},
      position = ${position},
      number = ${number},
      status = ${status},
      id_team = ${id_team}
    WHERE id_player = ${id_player}
    RETURNING id_player
  `;
    return result[0];
  }

async getprofileplayer(id_player: number) {
    const result = await this.sql`
      SELECT p.id_player, p.surname, p.name, p.mail, p.position, p.number, p.phone, p.status,team.name AS team_name
      FROM player AS p JOIN team ON p.id_team = team.id_team WHERE id_player = ${id_player}
    `;
    return result[0] || null;
  }

async getdetailsplayer(id_player: number) {
    const result = await this.sql`
      SELECT p.id_player, p.surname, p.name, p.mail, p.position, p.number, p.phone, p.status,team.name AS team_name,
      s.goals, s.passes, s.yellow_cards, s.red_cards
      FROM player AS p JOIN team ON p.id_team = team.id_team
      JOIN statistics s ON p.id_player = s.id_player WHERE p.id_player = ${id_player}
    `;
    return result[0] || null;
  }>

async addSubscription({
    id_player,
    total,
    status,
    payment_date,
  }: {
    id_player: number;
    total: number;
    status: string;
    payment_date: Date;
  }) {
    const result = await this.sql`
    INSERT INTO subscription (id_player, total, status, payment_date)
    VALUES (${id_player}, ${total}, ${status}, ${payment_date})
    RETURNING id_subscription
  `;
    return result[0];
  }
  async getallSubscriptions() {
    const result = await this.sql`
      SELECT
        s.id_subscription AS id,
        s.id_player,
        s.total,
        s.status,
        s.payment_date,
        p.name AS player_name,
        p.surname AS player_surname
      FROM subscription s
      JOIN player p ON p.id_player = s.id_player
      ORDER BY s.id_subscription DESC
    `;
    return result.map((r: any) => ({
      id: r.id,
      id_player: r.id_player,
      total_amount: r.total !== null ? Number(r.total) : 0,
      status: r.status,
      payment_date: r.payment_date,
      player: {
        name: r.player_name,
        surname: r.player_surname,
      },
    }));
  }
async subscriptionteam(id_team: number) {
    const result = await this.sql`
      SELECT
      count(*) AS total_players,
      count(CASE WHEN s.status = 'Paid' THEN 1 END) AS paid_players,
      count(CASE WHEN s.status = 'Late' THEN 1 END) AS late_players,
      count(CASE WHEN s.status = 'Not paid' THEN 1 END) AS unpaid_players
      FROM subscription s
      JOIN player p ON p.id_player = s.id_player
      WHERE p.id_team = ${id_team}
    `;
    return result[0];
  }
async getsubscriptionbyplayer(id_player: number) {
    const result = await this.sql`
      SELECT id_subscription, total, status, payment_date
      FROM subscription WHERE id_player = ${id_player}
    `;
    return result[0] || null;
  }
async getplayerwithnosubscription() {
    const result = await this.sql`
      SELECT id_player, surname, name, mail, position, number, phone, status,id_team
      FROM player WHERE id_player NOT IN (SELECT id_player FROM subscription)
    `;
    return result;
  }
async getstatisticsteam(id_team: number) {
    const result = await this.sql`
      SELECT
      COUNT(*) AS total_players,
      COUNT(CASE WHEN goals > 0 THEN 1 END) AS players_with_goals,
      COUNT(CASE WHEN passes > 0 THEN 1 END) AS players_with_passes,
      COUNT(CASE WHEN yellow_cards > 0 THEN 1 END) AS players_with_yellow_cards,
      COUNT(CASE WHEN red_cards > 0 THEN 1 END) AS players_with_red_cards
      FROM statistics s
      JOIN player p ON p.id_player = s.id_player
      WHERE id_team = ${id_team}
    `;
    return result[0];
  }
  async statisticsplayer(id_player: number) {
    const result = await this.sql`
      SELECT goals, passes, yellow_cards, red_cards
      FROM statistics
      WHERE id_player = ${id_player}
    `;
    return result[0] || null;
  }
async nextMatch() {
    const result = await this.sql`
      SELECT *
      FROM matches
      WHERE date >= CURRENT_DATE
      ORDER BY date ASC
      LIMIT 1
    `;
    return result[0] || null;
  }
async nextTraining(){
    const result = await this.sql`
      SELECT *
      FROM training
      WHERE date >= CURRENT_DATE
      ORDER BY date ASC
      LIMIT 1
    `;
    return result[0] || null;
  }

}


