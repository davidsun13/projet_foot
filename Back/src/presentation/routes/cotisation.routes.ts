import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { CotisationService } from "../../application/CotisationService";
import { CotisationRepository } from "../../infrastructure/database/repository";
import { ZodError } from "zod";

function formatZodError(err: ZodError) {
  return err.issues.map(issue => ({
    path: issue.path.join("."),
    message: issue.message
  }));
}

export async function cotisationRoutes(fastify: FastifyInstance, cotisationRepo: CotisationRepository) {
  const cotisationService = new CotisationService(cotisationRepo);

  // Get all cotisations (coach only)
  fastify.get("/api/cotisations", async (request: FastifyRequest, reply: FastifyReply): Promise<Cotisation[]> => {
    try {
      await request.jwtVerify();
      if (request.user.userType !== "coach") {
        return reply.status(403).send({ error: "Only coaches can view all cotisations" });
      }

      const cotisations = await cotisationService.getAll();
      return reply.send(cotisations);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  });

  // Get cotisation by ID
  fastify.get("/api/cotisations/:id", async (request: FastifyRequest, reply: FastifyReply): Promise<Cotisation> => {
    try {
      const { id } = request.params as { id: string };
      const cotisation = await cotisationService.getById(parseInt(id));
      return reply.send(cotisation);
    } catch (err: any) {
      return reply.status(404).send({ error: err.message });
    }
  });

  // Get cotisations by player
  fastify.get("/api/cotisations/player/:id_player", async (request: FastifyRequest, reply: FastifyReply): Promise<Cotisation[]> => {
    try {
      const { id_player } = request.params as { id_player: string };
      const cotisations = await cotisationService.getByPlayer(parseInt(id_player));
      return reply.send(cotisations);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  });

  // Create cotisation (coach only)
  fastify.post("/api/cotisations", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      if (request.user.userType !== "coach") {
        return reply.status(403).send({ error: "Only coaches can create cotisations" });
      }

      const { amount, id_player, status } = request.body as { amount: number; id_player: number; status?: string };
      if (!amount || !id_player) {
        return reply.status(400).send({ error: "Missing required fields" });
      }

      const cotisation = await cotisationService.create({
        amount,
        id_player,
        status: status || 'Pending',
        date_payment: null,
      });

      return reply.status(201).send(cotisation);
    } catch (err: any) {
      if (err instanceof ZodError) {
        return reply.status(400).send({ errors: formatZodError(err) });
      }
      return reply.status(400).send({ error: err.message });
    }
  });

  // Update cotisation status
  fastify.put("/api/cotisations/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      const { id } = request.params as { id: string };
      const { status } = request.body as { status: string };

      if (!['Pending', 'Paid', 'Overdue'].includes(status)) {
        return reply.status(400).send({ error: "Invalid status" });
      }

      const cotisation = await cotisationService.updatePaymentStatus(parseInt(id), status);
      return reply.send(cotisation);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  // Delete cotisation
  fastify.delete("/api/cotisations/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      if (request.user.userType !== "coach") {
        return reply.status(403).send({ error: "Only coaches can delete cotisations" });
      }

      const { id } = request.params as { id: string };
      await cotisationService.delete(parseInt(id));

      return reply.send({ message: "Cotisation deleted" });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });
}
