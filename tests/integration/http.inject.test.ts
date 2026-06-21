import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildWebServer } from '../../Back/src/server.ts';
import type { FastifyInstance } from 'fastify';

describe('Fastify HTTP routes via inject', () => {
  let server: FastifyInstance;
  interface FakeRepo {
    registerPlayer: ReturnType<typeof vi.fn>;
    saveRefreshToken: ReturnType<typeof vi.fn>;
    loginPlayer: ReturnType<typeof vi.fn>;
    getPlayerById: ReturnType<typeof vi.fn>;
  }

  const fakeRepo: FakeRepo = {
    registerPlayer: vi.fn(),
    saveRefreshToken: vi.fn(),
    loginPlayer: vi.fn(),
    getPlayerById: vi.fn(),
  };

  beforeEach(async () => {
    fakeRepo.registerPlayer.mockReset();
    fakeRepo.saveRefreshToken.mockReset();
    fakeRepo.loginPlayer.mockReset();
    fakeRepo.getPlayerById.mockReset();

    server = await buildWebServer(fakeRepo as any);
  });

  afterEach(async () => {
    await server.close();
  });

  it('POST /register returns accessToken and sets refresh_token cookie', async () => {
    fakeRepo.registerPlayer.mockResolvedValue({
      id_player: 1,
      surname: 'Paul',
      name: 'Dupont',
      mail: 'paul@mail.test',
    });
    fakeRepo.saveRefreshToken.mockResolvedValue({});

    const response = await server.inject({
      method: 'POST',
      url: '/register',
      payload: {
        surname: 'Paul',
        name: 'Dupont',
        mail: 'paul@mail.test',
        password: 'secret',
      },
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.accessToken).toBeTruthy();
    expect(body.user).toEqual({
      id_player: 1,
      surname: 'Paul',
      name: 'Dupont',
      mail: 'paul@mail.test',
    });
    expect(response.headers['set-cookie']).toContain('refresh_token=');
    expect(fakeRepo.registerPlayer).toHaveBeenCalledOnce();
    expect(fakeRepo.saveRefreshToken).toHaveBeenCalledOnce();
  });

  it('GET /secret-data returns 401 without authorization and 200 with valid token', async () => {
    const unauthorizedResponse = await server.inject({
      method: 'GET',
      url: '/secret-data',
    });

    expect(unauthorizedResponse.statusCode).toBe(401);

    const token = server.jwt.sign({ id: 1, userType: 'player' }, { expiresIn: '15m' });
    fakeRepo.getPlayerById.mockResolvedValue({ id_player: 1, surname: 'Paul', name: 'Dupont', mail: 'paul@mail.test' });

    const authorizedResponse = await server.inject({
      method: 'GET',
      url: '/secret-data',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(authorizedResponse.statusCode).toBe(200);
    expect(authorizedResponse.json()).toEqual({
      message: 'Accès autorisé',
      data: 'Voici la fausse donnée secrète',
    });
  });
});
