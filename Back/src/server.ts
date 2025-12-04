import Fastify from "fastify";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fastifyJwt from "@fastify/jwt";
import helmet from "@fastify/helmet";
import cookie from "@fastify/cookie";
import { registerSchema, loginSchema } from "./models/connexion.cjs";
import { createTrainingSchema } from "./models/training.cjs";
import { ZodError } from "zod";
import { Repository } from "./db.cjs";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: number };
    user: { id: number };
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
    credentials: true
  });


  await web_server.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"]
      }
    }
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
  web_server.post("/register", async (request, reply) => {
    try {
      const parsed = registerSchema.parse(request.body);

      const user = await repo.registerPlayer({
        surname: parsed.surname,
        name: parsed.name,
        mail: parsed.mail,
        phone: parsed.phone ?? null,
        password: parsed.password,
      });

      const accessToken = web_server.jwt.sign({ id: user.id_player }, { expiresIn: "15m" });
      const refreshToken = web_server.jwt.sign({ id: user.id_player }, { expiresIn: "7d" });

      await repo.saveRefreshToken({
        userId: user.id_player,
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

  web_server.post("/login", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const parsed = loginSchema.parse(request.body);
      const { mail, password } = parsed;

      const user = await repo.loginPlayer(mail, password);

      const accessToken = web_server.jwt.sign({ id: user.id_player }, { expiresIn: "15m" });
      const refreshToken = web_server.jwt.sign({ id: user.id_player }, { expiresIn: "7d" });

      await repo.saveRefreshToken({
        userId: user.id_player,
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
  web_server.post("/refresh", async (request: FastifyRequest, reply: FastifyReply) => {
    const oldRefresh = (request.cookies as any)?.refresh_token;
    if (!oldRefresh) return reply.status(401).send({ error: "No refresh token" });

    try {
      const payload = web_server.jwt.verify<{ id: number }>(oldRefresh);

      const stored = await repo.findRefreshToken(oldRefresh);
      if (!stored) return reply.status(401).send({ error: "Refresh token not found or revoked" });

      if (new Date(stored.expires_at) < new Date()) {
        await repo.revokeRefreshToken(oldRefresh);
        return reply.status(401).send({ error: "Refresh token expired" });
      }

      await repo.revokeRefreshToken(oldRefresh);

      const newRefresh = web_server.jwt.sign({ id: payload.id }, { expiresIn: "7d" });
      const newAccess = web_server.jwt.sign({ id: payload.id }, { expiresIn: "15m" });

      await repo.saveRefreshToken({
        userId: payload.id,
        token: newRefresh,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      reply.setCookie("refresh_token", newRefresh, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      return reply.send({ accessToken: newAccess });
    } catch (err) {
      try {
        await repo.revokeRefreshToken(oldRefresh);
      } catch (_) {
      }
      return reply.status(401).send({ error: "Invalid refresh token" });
    }
  });

  web_server.post("/logout", async (request: FastifyRequest, reply: FastifyReply) => {
    const token = (request.cookies as any)?.refresh_token;
    if (token) {
      await repo.revokeRefreshToken(token);
      reply.clearCookie("refresh_token");
    }
    return reply.send({ message: "Logged out" });
  });

  web_server.get("/protected", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      return reply.send({ message: "Route protégée OK", user: (request as any).user });
    } catch {
      return reply.status(401).send({ error: "Token invalide" });
    }
  });

  web_server.post("/createtraining", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const parsed = createTrainingSchema.parse(request.body);
      const training = await repo.createTrainingSession(parsed);
      return reply.send(training);
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.status(400).send({ errors: formatZodError(err) });
      }
      return reply.status(500).send({ error: (err as Error).message });
    }
  });
  web_server.put("/modifytraining", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const training = await repo.modifyTrainingSession(body);
      return reply.send(training);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  }
  );
  web_server.delete("/deletetraining/:id_training", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const id_training = Number((request.params as any).id_training);
      const training = await repo.deleteTrainingSession(id_training);
      return reply.send(training);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  }
  );
  web_server.get("/trainings", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const trainings = await repo.listTrainingSessions();
      return reply.send(trainings);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  }
  );
  web_server.post("/creatematch", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const match = await repo.createMatchSession(body);
      return reply.send(match);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  });
  web_server.put("/modifymatch", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as any;
      const match = await repo.modifyMatchSession(body);
      return reply.send(match);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  }
  );
  web_server.delete("/deletematch/:id_match", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const id_match = Number((request.params as any).id_match);
      const match = await repo.deleteMatchSession(id_match);
      return reply.send(match);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  }
  );
  web_server.get("/matchs", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const matches = await repo.listMatchSessions();
      return reply.send(matches);
    } catch (err) {
      return reply.status(500).send({ error: (err as Error).message });
    }
  }
  );

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
