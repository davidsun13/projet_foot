import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { MatchService } from "../../application/MatchService";
import { MatchRepository } from "../../infrastructure/database/repository";
import { createMatchSchema, updateScoreSchema } from "../../models/match.cjs";
import { ZodError } from "zod";

function formatZodError(err: ZodError) {
  return err.issues.map(issue => ({
    path: issue.path.join("."),
    message: issue.message
  }));
}

export async function matchRoutes(fastify: FastifyInstance, matchRepo: MatchRepository) {
  const matchService = new MatchService(matchRepo);

  // Get all matches
  fastify.get("/api/matches", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const matches = await matchService.getAll();
      return reply.send(matches);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  });

  // Get match by ID
  fastify.get("/api/matches/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const match = await matchService.getById(parseInt(id));
      return reply.send(match);
    } catch (err: any) {
      return reply.status(404).send({ error: err.message });
    }
  });

  // Create match (coach only)
  fastify.post("/api/matches", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      if (request.user.userType !== "coach") {
        return reply.status(403).send({ error: "Only coaches can create matches" });
      }

      const parsed = createMatchSchema.parse(request.body as Record<string, unknown>);
      const match = await matchService.create({
        ...parsed,
        id_coach: request.user.id,
      });

      return reply.status(201).send(match);
    } catch (err: any) {
      if (err instanceof ZodError) {
        return reply.status(400).send({ errors: formatZodError(err) });
      }
      return reply.status(400).send({ error: err.message });
    }
  });

  // Update match score
  fastify.put("/api/matches/:id/score", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      const { id } = request.params as { id: string };
      const parsed = updateScoreSchema.parse(request.body as Record<string, unknown>);

      const match = await matchService.updateScore(
        parseInt(id),
        parsed.score_home,
        parsed.score_outside
      );

      return reply.send(match);
    } catch (err: any) {
      if (err instanceof ZodError) {
        return reply.status(400).send({ errors: formatZodError(err) });
      }
      return reply.status(400).send({ error: err.message });
    }
  });

  // Delete match
  fastify.delete("/api/matches/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      if (request.user.userType !== "coach") {
        return reply.status(403).send({ error: "Only coaches can delete matches" });
      }

      const { id } = request.params as { id: string };
      await matchService.delete(parseInt(id));

      return reply.send({ message: "Match deleted" });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });
}
