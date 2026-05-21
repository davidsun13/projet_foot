import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { TrainingService } from "../../application/TrainingService";
import { TrainingRepository } from "../../infrastructure/database/repository";
import { createTrainingSchema } from "../../models/training.cjs";
import { ZodError } from "zod";

function formatZodError(err: ZodError) {
  return err.issues.map(issue => ({
    path: issue.path.join("."),
    message: issue.message
  }));
}

export async function trainingRoutes(fastify: FastifyInstance, trainingRepo: TrainingRepository) {
  const trainingService = new TrainingService(trainingRepo);

  // Get all trainings
  fastify.get("/api/trainings", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const trainings = await trainingService.getAll();
      return reply.send(trainings);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  });

  // Get training by ID
  fastify.get("/api/trainings/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const training = await trainingService.getById(parseInt(id));
      return reply.send(training);
    } catch (err: any) {
      return reply.status(404).send({ error: err.message });
    }
  });

  // Create training (coach only)
  fastify.post("/api/trainings", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      if (request.user.userType !== "coach") {
        return reply.status(403).send({ error: "Only coaches can create trainings" });
      }

      const parsed = createTrainingSchema.parse(request.body as Record<string, unknown>);
      const training = await trainingService.create({
        ...parsed,
        id_coach: request.user.id,
      });

      return reply.status(201).send(training);
    } catch (err: any) {
      if (err instanceof ZodError) {
        return reply.status(400).send({ errors: formatZodError(err) });
      }
      return reply.status(400).send({ error: err.message });
    }
  });

  // Update training
  fastify.put("/api/trainings/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      if (request.user.userType !== "coach") {
        return reply.status(403).send({ error: "Only coaches can update trainings" });
      }

      const { id } = request.params as { id: string };
      const parsed = createTrainingSchema.partial().parse(request.body as Record<string, unknown>);

      const training = await trainingService.update(parseInt(id), parsed);
      return reply.send(training);
    } catch (err: any) {
      if (err instanceof ZodError) {
        return reply.status(400).send({ errors: formatZodError(err) });
      }
      return reply.status(400).send({ error: err.message });
    }
  });

  // Delete training
  fastify.delete("/api/trainings/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      if (request.user.userType !== "coach") {
        return reply.status(403).send({ error: "Only coaches can delete trainings" });
      }

      const { id } = request.params as { id: string };
      await trainingService.delete(parseInt(id));

      return reply.send({ message: "Training deleted" });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });
}
