import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { start_web_server } from '../../Back/src/server.ts';

const mockRepo: any = {
  loginPlayer: vi.fn(async (mail: string, password: string) => {
    return { id_player: 1, surname: 'Paul', name: 'Dupont', mail };
  }),
  loginCoach: vi.fn(async (mail: string, password: string) => {
    return { id_coach: 10, surname: 'Coach', name: 'Test', mail };
  }),
  saveRefreshToken: vi.fn(async () => ({ id: 1 })),
  registerPlayer: vi.fn(async ({ surname, name, mail }: any) => ({ id_player: 2, surname, name, mail })),
  createMatchSession: vi.fn(async (data: any) => ({
    id_match: 100,
    date: data.date,
    hour: data.hour,
    opponent: data.opponent,
    location: data.location,
    type: data.type,
    id_team: data.id_team,
    score_home: data.score_home ?? 0,
    score_outside: data.score_outside ?? 0,
  })),
};

let app: any;
let coachToken: string;

beforeAll(async () => {
  app = await start_web_server({ repo: mockRepo, listen: false });
  await app.ready();

  const loginRes = await app.inject({
    method: 'POST',
    url: '/logincoach',
    payload: { mail: 'coach@mail.test', password: 'secret' },
  });
  const loginBody = JSON.parse(loginRes.body);
  coachToken = loginBody.accessToken;
});

afterAll(async () => {
  await app.close();
});

describe('Backend API', () => {
  it('POST /login returns accessToken and sets refresh_token cookie', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/login',
      payload: { mail: 'test@mail.test', password: 'secret' },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('user');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('POST /register creates a user and returns accessToken', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/register',
      payload: {
        surname: 'New',
        name: 'User',
        mail: 'new@mail.test',
        password: 'pw1234',
      },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('user');
  });

  it('POST /matchs without token returns 401', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/matchs',
      payload: {
        date: '2026-06-15',
        hour: '15:00',
        opponent: 'Paris FC',
        location: 'Home',
        type: 'Championship',
        id_team: 1,
      },
    });

    expect(res.statusCode).toBe(401);
    expect(JSON.parse(res.body)).toHaveProperty('error');
  });

  it('POST /matchs with invalid payload returns 422', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/matchs',
      headers: { Authorization: `Bearer ${coachToken}` },
      payload: {
        date: '2026-06-15',
        hour: '15:00',
        location: 'Home',
        type: 'Championship',
        id_team: 1,
      },
    });

    expect(res.statusCode).toBe(422);
    expect(JSON.parse(res.body)).toHaveProperty('errors');
  });

  it('POST /matchs with valid payload returns 201 and created match data', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/matchs',
      headers: { Authorization: `Bearer ${coachToken}` },
      payload: {
        date: '2026-06-15',
        hour: '15:00',
        opponent: 'Paris FC',
        location: 'Home',
        type: 'Championship',
        id_team: 1,
        score_home: 0,
        score_outside: 0,
      },
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body).toHaveProperty('id_match');
    expect(body.opponent).toBe('Paris FC');
    expect(body.location).toBe('Home');
  });
});
