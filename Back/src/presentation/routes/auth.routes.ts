import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "../../application/AuthService";
import { PlayerRepository, CoachRepository } from "../../infrastructure/database/repository";
import { registerSchema, loginSchema } from "../../models/connexion.cjs";
import { ZodError } from "zod";
import * as crypto from "node:crypto";

function generateRefreshToken() {
  return crypto.randomBytes(48).toString("hex");
}

function formatZodError(err: ZodError) {
  return err.issues.map(issue => ({
    path: issue.path.join("."),
    message: issue.message
  }));
}

export async function authRoutes(
  fastify: FastifyInstance,
  playerRepo: PlayerRepository,
  coachRepo: CoachRepository
) {
  const authService = new AuthService(playerRepo, coachRepo);
  const isProduction = process.env.NODE_ENV === "production";

  // Register Player
  fastify.post("/auth/register/player", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const parsed = registerSchema.parse(request.body as Record<string, unknown>);
      const user = await authService.registerPlayer(parsed);

      const accessToken = fastify.jwt.sign(
        { id: user.id_player, userType: "player" },
        { expiresIn: "15m" }
      );

      const refreshToken = generateRefreshToken();

      reply.setCookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      return reply.send({ accessToken, user });
    } catch (err: any) {
      if (err instanceof ZodError) {
        return reply.status(400).send({ errors: formatZodError(err) });
      }
      return reply.status(400).send({ error: err.message });
    }
  });

  // Register Coach
  fastify.post("/auth/register/coach", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const parsed = registerSchema.parse(request.body as Record<string, unknown>);
      const user = await authService.registerCoach(parsed);

      const accessToken = fastify.jwt.sign(
        { id: user.id_coach, userType: "coach" },
        { expiresIn: "15m" }
      );

      const refreshToken = generateRefreshToken();

      reply.setCookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      return reply.send({ accessToken, user });
    } catch (err: any) {
      if (err instanceof ZodError) {
        return reply.status(400).send({ errors: formatZodError(err) });
      }
      return reply.status(400).send({ error: err.message });
    }
  });

  // Login Player
  fastify.post("/auth/login/player", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const parsed = loginSchema.parse(request.body as Record<string, unknown>);
      const user = await authService.loginPlayer(parsed.mail, parsed.password);

      const accessToken = fastify.jwt.sign(
        { id: user.id_player, userType: "player" },
        { expiresIn: "15m" }
      );

      const refreshToken = generateRefreshToken();

      reply.setCookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      return reply.send({ accessToken, user });
    } catch (err: any) {
      if (err instanceof ZodError) {
        return reply.status(400).send({ errors: formatZodError(err) });
      }
      return reply.status(401).send({ error: err.message });
    }
  });

  // Login Coach
  fastify.post("/auth/login/coach", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const parsed = loginSchema.parse(request.body as Record<string, unknown>);
      const user = await authService.loginCoach(parsed.mail, parsed.password);

      const accessToken = fastify.jwt.sign(
        { id: user.id_coach, userType: "coach" },
        { expiresIn: "15m" }
      );

      const refreshToken = generateRefreshToken();

      reply.setCookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      return reply.send({ accessToken, user });
    } catch (err: any) {
      if (err instanceof ZodError) {
        return reply.status(400).send({ errors: formatZodError(err) });
      }
      return reply.status(401).send({ error: err.message });
    }
  });

  // Logout
  fastify.post("/auth/logout", async (request: FastifyRequest, reply: FastifyReply) => {
    reply.clearCookie("refresh_token");
    return reply.send({ message: "Logged out" });
  });
}
