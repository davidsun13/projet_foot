declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: string; iat?: number; exp?: number };
    user: { id: string };
    userType: 'player' | 'coach';
  }
}
