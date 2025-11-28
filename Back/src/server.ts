import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Repository } from "./db.cjs";
import helmet from "@fastify/helmet";
import cookie from "@fastify/cookie";
import fastifyJwt, { FastifyJWTOptions } from "@fastify/jwt";
import argon2 from "argon2";


declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: string };
    user: any;
  }
}
interface RegisterBody {
  surname: string;
  name: string;
  mail: string;
  phone: string;
  password: string;
}

interface LoginBody {
  mail: string;
  password: string;
}

function start_web_server() {
  const web_server: FastifyInstance = Fastify({ logger: true });
  const repo = new Repository();

  const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_change_me";
  const COOKIE_SECRET = process.env.COOKIE_SECRET || "dev_cookie_secret_change_me";

  web_server.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
      },
    },
  });

  web_server.register(cookie, {
    secret: COOKIE_SECRET,
    hook: "onRequest",
  });

  web_server.register(fastifyJwt, {
    secret: JWT_SECRET,
    cookie: {
      cookieName: "refresh_token",
      signed: false,
    },
    sign: { expiresIn: "15m" },
  } as FastifyJWTOptions);

  web_server.post(
    "/register",
    async (request: FastifyRequest<{ Body: RegisterBody }>, reply: FastifyReply) => {
      const { surname, name, mail, phone, password } = request.body;

      try {
        const user = await repo.registerPlayer({ surname, name, mail, phone, password });

        const accessToken = web_server.jwt.sign({ id: user.id_player }, { expiresIn: "15m" });
        const refreshToken = web_server.jwt.sign({ id: user.id_player }, { expiresIn: "7d" });

        reply.setCookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
        });

        reply.send({ accessToken, user });
      } catch (error) {
        reply.status(400).send({ error: (error as Error).message });
      }
    }
  );

  web_server.post(
    "/login",
    async (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
      const { mail, password } = request.body;

      try {
        const user = await repo.loginPlayer(mail, password);

        const accessToken = web_server.jwt.sign({ id: user.id_player }, { expiresIn: "15m" });
        const refreshToken = web_server.jwt.sign({ id: user.id_player }, { expiresIn: "7d" });

        reply.setCookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          path: "/",
        });

        reply.send({ accessToken, user });
      } catch (error) {
        reply.status(401).send({ error: (error as Error).message });
      }
    }
  );
  web_server.post("/refresh", async (request: FastifyRequest, reply: FastifyReply) => {
    const refresh = request.cookies.refresh_token;

    if (!refresh) return reply.status(401).send({ error: "No refresh token" });

    try {
      const payload = web_server.jwt.verify<{ id: string }>(refresh);
      const newAccess = web_server.jwt.sign({ id: payload.id }, { expiresIn: "15m" });
      reply.send({ accessToken: newAccess });
    } catch {
      reply.status(401).send({ error: "Invalid refresh token" });
    }
  });

  web_server.get("/protected", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify(); // vérifie le token access
      reply.send({ message: "Route protégée OK", user: request.user });
    } catch {
      reply.status(401).send({ error: "Token invalide" });
    }
  });

  web_server.listen({ port: 1234, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    } else {
      console.log(`listening on ${address}`);
    }
  });
}

start_web_server();
