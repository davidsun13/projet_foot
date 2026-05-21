// New server.ts integration with Clean Architecture

import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import fastifyJwt from "@fastify/jwt";
import cookie from "@fastify/cookie";

// Import repositories
import {
  PlayerRepository,
  CoachRepository,
  MatchRepository,
  TrainingRepository,
  CotisationRepository,
} from "./infrastructure/database/repository";

// Import routes
import {
  authRoutes,
  matchRoutes,
  trainingRoutes,
  cotisationRoutes,
} from "./presentation/routes";

process.loadEnvFile();

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_change_me";
const COOKIE_SECRET = process.env.COOKIE_SECRET || "dev_cookie_secret_change_me";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: number };
    user: { id: number; userType: 'player' | 'coach' };
  }
}

export async function start_web_server() {
  const web_server: FastifyInstance = Fastify({ logger: true });

  // Initialize repositories (dependencies)
  const playerRepo = new PlayerRepository();
  const coachRepo = new CoachRepository();
  const matchRepo = new MatchRepository();
  const trainingRepo = new TrainingRepository();
  const cotisationRepo = new CotisationRepository();

  // Register middleware
  web_server.register(require("@fastify/cors"), {
    origin: ["http://localhost", "http://localhost:5173", "http://172.17.250.127"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
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

  // Register routes
  await authRoutes(web_server, playerRepo, coachRepo);
  await matchRoutes(web_server, matchRepo);
  await trainingRoutes(web_server, trainingRepo);
  await cotisationRoutes(web_server, cotisationRepo);

  // Health check
  web_server.get("/health", async () => {
    return { status: "ok" };
  });

  // Start server
  const start = async () => {
    try {
      await web_server.listen({ port: 3000, host: "0.0.0.0" });
      console.log("Server started on http://0.0.0.0:3000");
    } catch (err) {
      web_server.log.error(err);
      process.exit(1);
    }
  };

  return { web_server, start };
}

// Export for testing
export { PlayerRepository, CoachRepository, MatchRepository, TrainingRepository, CotisationRepository };
