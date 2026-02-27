import Fastify from "fastify";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fastifyJwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import { registerSchema, loginSchema } from "./models/connexion.cjs";
import { createTrainingSchema } from "./models/training.cjs";
import { createMatchSchema, updateScoreSchema } from "./models/match.cjs";
import { ZodError } from "zod";
import { Repository } from "./db.cjs";
import * as crypto from "node:crypto";

function generateRefreshToken() {
  return crypto.randomBytes(48).toString("hex");
}
declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: number };
    user: { id: number };
    userType: 'player' | 'coach';
  }
}

export async function start_web_server() {
  const web_server: FastifyInstance = Fastify({ logger: true });
  const repo = new Repository();

  const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_change_me";
  const COOKIE_SECRET = process.env.COOKIE_SECRET || "dev_cookie_secret_change_me";
  const isProduction = process.env.NODE_ENV === "production";

  web_server.register(require("@fastify/cors"), {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  });
  await web_server.register(cookie, {
    secret: COOKIE_SECRET,
    hook: "onRequest",
  });

  await web_server.register(fastifyJwt, {
    secret: JWT_SECRET,
    cookie: {
      cookieName: "refresh_token",
      signed: false,
    },
    sign: { expiresIn: "15m" },
  });
  function formatZodError(err: ZodError) {
    return err.issues.map(issue => ({
      path: issue.path.join("."),
      message: issue.message
    }));
  }
  async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
  } catch {
    reply.status(401).send({ error: "Unauthorized" });
  }
}
async function requireCoach(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();

    if (request.user.userType !== "coach") {
      return reply.status(403).send({ error: "Forbidden" });
    }
  } catch {
    reply.status(401).send({ error: "Unauthorized" });
  }
}


  web_server.post("/registercoach", async (request, reply) => {
    try {
      const parsed = registerSchema.parse(request.body);

      const user = await repo.registerCoach({
        surname: parsed.surname,
        name: parsed.name,
        mail: parsed.mail,
        phone: parsed.phone ?? null,
        password: parsed.password,
      });

      const accessToken = web_server.jwt.sign(
        { id: user.id_coach },
        { expiresIn: "15m" }
      );

      const refreshToken = generateRefreshToken();

      await repo.saveRefreshToken({
        userId: user.id_coach,
        userType: "coach",
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      reply.setCookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      return reply.send({ accessToken, user });
    } catch (err) {
      return reply.status(400).send({ error: (err as Error).message });
    }
  });
  web_server.post("/register", async (request, reply) => {
    try {
      const parsed = registerSchema.parse(request.body);

      const user = await repo.registerPlayer({
        surname: parsed.surname,
        name: parsed.name,
        mail: parsed.mail,
        phone: parsed.phone ?? null,
        password: parsed.password
      });

      const accessToken = web_server.jwt.sign(
        { id: user.id_player },
        { expiresIn: "15m" }
      );

      const refreshToken = generateRefreshToken();
      await repo.saveRefreshToken({
        userId: user.id_player,
        userType: "player",
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      reply.setCookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      return reply.send({ accessToken, user });
    } catch (err) {
      return reply.status(400).send({ error: (err as Error).message });
    }
  });


  web_server.post("/login", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const parsed = loginSchema.parse(request.body);
      const { mail, password } = parsed;

      const user = await repo.loginPlayer(mail, password);

      const accessToken = web_server.jwt.sign({ id: user.id_player, userType: "player" }, { expiresIn: "15m" });
      const refreshToken = generateRefreshToken();

      await repo.saveRefreshToken({
        userId: user.id_player,
        userType: "player",
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      reply.setCookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      return reply.send({ accessToken, user });
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.status(400).send({ errors: formatZodError(err) });
      }
      return reply.status(401).send({ error: (err as Error).message });
    }
  });

  web_server.post("/logincoach", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const parsed = loginSchema.parse(request.body);
      const { mail, password } = parsed;
      const user = await repo.loginCoach(mail, password);
      const accessToken = web_server.jwt.sign({ id: user.id_coach, userType: "coach" }, { expiresIn: "15m" });
      const refreshToken = generateRefreshToken();
      await repo.saveRefreshToken({
        userId: user.id_coach,
        userType: "coach",
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      reply.setCookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
      return reply.send({ accessToken, user });
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.status(400).send({ errors: formatZodError(err) });
      }
      return reply.status(400).send({ error: (err as Error).message });
    }
  });
  web_server.post("/refresh", async (request, reply) => {
    const oldRefresh = request.cookies?.refresh_token;
    if (!oldRefresh) return reply.status(401).send({ error: "No refresh token" });

    const stored = await repo.findRefreshToken(oldRefresh);

    if (!stored || stored.revoked)
      return reply.status(401).send({ error: "Refresh token invalid" });

    if (new Date(stored.expires_at) < new Date()) {
      await repo.revokeRefreshToken(oldRefresh);
      return reply.status(401).send({ error: "Expired refresh token" });
    }

    await repo.revokeRefreshToken(oldRefresh);

    const userId = stored.userType === "player" ? stored.player_id : stored.coach_id;

    const newRefresh = generateRefreshToken();
    const newAccess = web_server.jwt.sign({ id: userId, userType: stored.userType }, { expiresIn: "15m" });

    await repo.saveRefreshToken({
      token: newRefresh,
      userId,
      userType: stored.userType,
      revoked: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    reply.setCookie("refresh_token", newRefresh, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      path: "/",
    });

    return reply.send({ accessToken: newAccess });
  });


  web_server.post("/logout", async (request, reply) => {
    const token = request.cookies?.refresh_token;
    if (token) {
      await repo.revokeRefreshToken(token);
      reply.clearCookie("refresh_token");
    }
    return reply.send({ message: "Logged out" });
  });


  web_server.get("/secret-data", async (request, reply) => {
    try {
      await request.jwtVerify();
      return reply.send({
        message: "Accès autorisé",
        data: "Voici la fausse donnée secrète",
      });
    } catch {
      return reply.status(401).send({ error: "Token invalide ou expiré" });
    }
  });

  web_server.post("/createtraining",{preHandler: [requireCoach]}, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const parsed = createTrainingSchema.parse(request.body);
      const training = await repo.createTrainingSession(parsed);
      console.log("Entraînement créé :", parsed);
      return reply.send(training);
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.status(400).send({ errors: formatZodError(err) });
      }
      return reply.status(500).send({ error: (err as Error).message });
    }
  });
  web_server.get("/trainings/:id_training", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const id_training = Number((request.params as any).id_training);
      const training = await repo.getTrainingById(id_training);
      return reply.send(training);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  });
  web_server.put("/training/:id_training/modify",{preHandler: [requireCoach]}, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const training = await repo.modifyTrainingSession(body);
      return reply.send(training);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  }
  );
  web_server.delete("/deletetraining/:id_training",{preHandler: [requireCoach]}, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const id_training = Number((request.params as any).id_training);
      const training = await repo.deleteTrainingSession(id_training);
      return reply.send(training);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  }
  );
  web_server.get("/trainings",{preHandler: [requireAuth]}, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const trainings = await repo.getAllTrainings();
      return reply.send(trainings);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  }
  );
  web_server.post("/creatematch",{preHandler: [requireCoach]},async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const parsed = createMatchSchema.parse(body);
      const match = await repo.createMatchSession(parsed);
      return reply.send(match);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  });

  web_server.put("/modifymatch",{preHandler: [requireCoach]}, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const match = await repo.modifyMatchSession(body);
      return reply.send(match);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  }
  );
  web_server.delete("/deletematch/:id_match",{preHandler: [requireCoach]}, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const id_match = Number((request.params as any).id_match);
      const match = await repo.deleteMatchSession(id_match);
      return reply.send(match);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  }
  );
  web_server.patch("/matchs/:id/score", async (request, reply) => {
    try {
      const id_match = Number((request.params as any).id);
      const parsed = updateScoreSchema.parse(request.body);

      const result = await repo.updateMatchScore({
        id_match,
        ...parsed,
      });

      return reply.send(result);
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.status(400).send({ errors: err.errors });
      }
      return reply.status(500).send({ error: (err as Error).message });
    }
  });

  web_server.get("/matchs",{preHandler: [requireAuth]}, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const matches = await repo.listMatchSessions();
      return reply.send(matches);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  }
  );
  web_server.post("/createteam", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const team = await repo.createTeam(body);
      return reply.send(team);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  });
  web_server.get("/teams", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const teams = await repo.listTeams();
      return reply.send(teams);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  });
  web_server.put("/modifyteam", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const team = await repo.modifyTeam(body);
      return reply.send(team);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  });
  web_server.delete("/deleteteam/:id_team", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const id_team = Number((request.params as any).id_team);
      const team = await repo.deleteTeam(id_team);
      return reply.send(team);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  });
  web_server.get("/me", async (request, reply) => {
    try {
      await request.jwtVerify();

      const { id, userType } = request.user;

      let user;

      if (userType === "player") {
        user = await repo.getPlayerById(id);
      } else {
        user = await repo.getCoachById(id);
      }

      return reply.send({
        userType,
        user,
      });

    } catch (err) {
      return reply.status(401).send({ error: "Unauthorized" });
    }
  });
  web_server.get("/players", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const players = await repo.getallPlayers();
      return reply.send(players);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  });
  web_server.put(
    "/players/:id_player/modify",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id_player } = request.params as { id_player: string };
        const body = request.body as {
          surname: string;
          name: string;
          position: string;
          number: number;
          status: string;
          id_team: number;
        };

        const player = await repo.updatePlayer({
          id_player: Number(id_player),
          ...body,
        });

        return reply.send(player);
      } catch (err) {
        return reply.status(500).send({ error: (err as Error).message });
      }
    }
  );
  web_server.get("/players/:id_player", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id_player } = request.params as { id_player: string };
      const player = await repo.getplayerbyid(Number(id_player));
      return reply.send(player);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  });

  web_server.get("/player-profile/:id_player", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id_player } = request.params as { id_player: string };
      const player = await repo.getprofileplayer(Number(id_player));
      return reply.send(player);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  });
  web_server.get("/detailsplayer/:id_player", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id_player } = request.params as { id_player: string };
      const player = await repo.getdetailsplayer(Number(id_player));
      return reply.send(player);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  });
  web_server.get("/convocationstraining/:id_player", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id_player } = request.params as { id_player: string };
      const convocations = await repo.getConvocationsTrainingbyplayer(Number(id_player));
      return reply.send(convocations);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  });
  web_server.get("/convocationsmatch/:id_player", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id_player } = request.params as { id_player: string };
      const convocations = await repo.getConvocationsMatchbyplayer(Number(id_player));
      return reply.send(convocations);
    } catch (err) {      return reply.status(500).send({ error: (err as Error).message });
    }
  });
  web_server.get("/convocationstraining/coach/:id_training", async (request: FastifyRequest, reply: FastifyReply) => {
    try {      
      const { id_training } = request.params as { id_training: string };
      const convocations = await repo.getConvocationsByTraining(Number(id_training));      
      return reply.send(convocations);
    } catch (err) {      return reply.status(500).send({ error: (err as Error).message });
    }
  }); 
  web_server.get("/convocationsmatch/coach/:id_match", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id_match } = request.params as { id_match: string };
      const convocations = await repo.getConvocationsByMatch(Number(id_match) as number);
      return reply.send(convocations);
    } catch (err) {      return reply.status(500).send({ error: (err as Error).message });
    }
  });
  web_server.post("/addsubscription", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const subscription = await repo.addSubscription(body);
      return reply.send(subscription);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  });
  web_server.get("/subscriptions/:id_team", async (request: FastifyRequest, reply: FastifyReply) => {
    try {     
      const { id_team } = request.params as { id_team: string };
      const subscriptions = await repo.subscriptionteam(Number(id_team));
      return reply.send(subscriptions);
    } catch (err) {      
      return reply.status(500).send({ error: (err as Error).message });
    }
  });
  web_server.get("/subscriptions/player/:id_player", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id_player } = request.params as { id_player: string };
      const subscription = await repo.getsubscriptionbyplayer(Number(id_player));
      return reply.send(subscription);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  });
  web_server.get("/subscriptions/players", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const players = await repo.getplayerwithnosubscription();
      return reply.send(players);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  });
  web_server.get("/subscriptions", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const subscriptions = await repo.getallSubscriptions();
      return reply.send(subscriptions);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  });
  web_server.get("/statistics/:id_team", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id_team } = request.params as { id_team: string };
      const stats = await repo.getstatisticsteam(Number(id_team));
      return reply.send(stats);
    } catch (err) {      
      return reply.status(500).send({ error: (err as Error).message });
    }
  });
  web_server.get("/statistics/player/:id_player", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id_player } = request.params as { id_player: string };
      const stats = await repo.statisticsplayer(Number(id_player));
      return reply.send(stats);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  });
  web_server.get("/nextmatch", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const match = await repo.nextMatch();
      return reply.send(match);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  });
  web_server.get("/nexttraining", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const training = await repo.nextTraining();
      return reply.send(training);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  }); 
  const port = Number(process.env.PORT) || 1234;
  await web_server.listen({ port, host: "0.0.0.0" });
  web_server.log.info(`listening on http://0.0.0.0:${port}`);
}

if (require.main === module) {
  start_web_server().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
